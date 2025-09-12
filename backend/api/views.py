import random
import requests
import stripe
import decimal
import traceback

from rich.console import Console

from datetime import datetime, timedelta

from api import serializer as api_serializer
from api import models as api_models

from userauths.models import User, Profile

from django.db.models.functions import ExtractMonth, ExtractYear
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import Http404
from django.shortcuts import redirect, render, get_object_or_404
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string  # 确保已导入
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.db import models, transaction

from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status, viewsets, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response

from decimal import Decimal

# from distutils.util import strtobool  # 在Python 3.12+中已弃用

console = Console()


def strtobool(val):
    """
    Convert a string representation of truth to true (1) or false (0).

    True values are 'y', 'yes', 't', 'true', 'on', and '1'; false values
    are 'n', 'no', 'f', 'false', 'off', and '0'.  Raises ValueError if
    'val' is anything else.
    """
    val = val.lower()
    if val in ("y", "yes", "t", "true", "on", "1"):
        return 1
    elif val in ("n", "no", "f", "false", "off", "0"):
        return 0
    else:
        raise ValueError(f"invalid truth value {val!r}")


stripe.api_key = settings.STRIPE_SECRET_KEY
PAYPAL_CLIENT_ID = settings.PAYPAL_CLIENT_ID
PAYPAL_SECRET_ID = settings.PAYPAL_SECRET_ID


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializer.MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """因为这个是注册的View,用来创建用户的,所以要使用CreateAPIView"""

    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = api_serializer.RegisterSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [AllowAny]
    serializer_class = api_serializer.ProfileSerializer

    def get_object(self):
        user_id = self.kwargs["user_id"]
        user = get_object_or_404(api_models.User, id=user_id)
        return Profile.objects.get(user=user)


def generate_random_otp(length=7):
    otp = "".join([str(random.randint(0, 9)) for _ in range(length)])
    return otp


class PasswordResetVerifyAPIView(generics.RetrieveAPIView):
    """
    你可以将这个View理解为“忘记密码”的操作，而不是“重置”密码，不要看到名字里有Reset就是
    重置密码，实际上它只是一个生成重置密码的链接，并将它作为邮件内容发送到对应用户的邮箱
    中的功能而已，要先“忘记密码”，才能“重置密码”，用户点击邮箱中的链接跳转到前端网站中进行重置密码。
    RetrieveAPIView专门处理GET请求
    用于 " 获取单个对象 " 的操作
    """

    permission_classes = [AllowAny]

    # 🧐为什么这里要使用 UserSerializer?
    # 答:这里使用 UserSerializer 是因为 PasswordResetVerifyAPIView 继承自 RetrieveAPIView,
    # 该视图用于“获取单个对象”的详细信息（即返回单个用户对象的数据）。
    # RetrieveAPIView 需要一个 serializer_class 来将查询到的 User 实例序列化为 JSON 响应。
    # UserSerializer 能将 User 模型实例序列化为前端可用的数据格式,因此这里指定为 UserSerializer。
    serializer_class = api_serializer.UserSerializer

    def get_object(self):
        """
        🧐这个方法有什么用?为什么要重写?
        答:
            这个方法的作用是根据URL中的email参数获取对应的User对象。
            为什么要重写?
            因为Django REST framework的RetrieveAPIView默认是通过pk(主键)来查找对象的,
            但这里我们需要通过email字段来查找用户,所以需要重写get_object方法,实现自定义的查找逻辑。

            get_object是Django REST framework中RetrieveAPIView的实例方法,用于获取当前请求对应的对象。默认通过主键查找,可以重写以自定义查找逻辑。
        """
        email = self.kwargs["email"]  # 例如:api/v1/password-reset/xxxxx@gmail.com

        user = User.objects.filter(email=email).first()

        if user:
            uuidb64 = user.pk
            # 🧐 for_user有什么用?
            # 答: for_user方法的作用是根据传入的用户对象user,生成一个与该用户绑定的RefreshToken实例。
            # 这样可以确保生成的token是专属于该用户的,后续前端可用该token进行身份验证和刷新操作。
            # 生成的token专属于该用户,意味着token内容中包含了用户身份信息（如user_id）,
            # 但不需要在User表单独存储token字段。JWT（如SimpleJWT）是无状态的,token只在客户端保存,
            # 服务端只在验证时解码校验,无需持久化到数据库。你只需在需要时生成和验证token即可。
            refresh = RefreshToken.for_user(user)
            refresh_token = str(refresh)

            user.refresh_token = refresh_token
            user.otp = generate_random_otp()
            user.save()

            link = f"http://localhost:5173/create-new-password/?otp={user.otp}&uuidb64={uuidb64}&refresh_token={refresh_token}"

            context = {"link": link, "username": user.username}
            subject = "Password Reset Email"
            text_body = render_to_string("email/password_reset.txt", context)
            html_body = render_to_string("email/password_reset.html", context)
            msg = EmailMultiAlternatives(
                subject=subject,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
                body=text_body,
            )
            msg.attach_alternative(html_body, "text/html")
            msg.send()
            print("link ========", link)
            # 这里可以根据需要发送邮件,例如:
            # send_mail(subject, text_body, from_email, [user.email])
        return user


class PasswordChangeAPIView(generics.CreateAPIView):
    """这里是登录的时候，点击忘记密码，需要重置密码时使用的APIView"""

    permission_classes = [AllowAny]
    serializer_class = api_serializer.UserSerializer

    def create(self, request, *args, **kwargs):
        payload = request.data
        otp = payload["otp"]
        uuidb64 = payload["uuidb64"]
        password = payload["password"]

        user = User.objects.get(id=uuidb64, otp=otp)

        if user:
            user.set_password(password)
            # user.otp = ""
            user.save()

            return Response(
                {"message": "Password Changed Successfully!"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"message": "User does not found."}, status=status.HTTP_404_NOT_FOUND
            )


class ChangePasswordAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        user_id = request.data["user_id"]
        old_password = request.data["old_password"]
        new_password = request.data["new_password"]

        try:
            user = get_object_or_404(api_models.User, id=user_id)
            # 🧐这一步在干嘛？
            if check_password(old_password, user.password):
                user.set_password(new_password)
                user.save()
                return Response(
                    {"message": "密码修改成功", "icon": "success"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "旧密码输入错误", "icon": "warning"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Http404:
            return Response(
                {"message": "用户不存在，密码修改失败", "icon": "error"},
                status=status.HTTP_404_NOT_FOUND,
            )


class CategoryListAPIView(generics.ListAPIView):
    queryset = api_models.Category.objects.filter(active=True)  # 获取有效状态的分类
    serializer_class = api_serializer.CategorySerializer
    permission_classes = [AllowAny]


class CourseListAPIView(generics.ListAPIView):
    queryset = api_models.Course.objects.filter(
        platform_status="Published", teacher_course_status="Published"
    )
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [AllowAny]


class CourseDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        slug = self.kwargs["slug"]  # 🧐这行代码是什么意思?
        course = api_models.Course.objects.get(
            slug=slug, platform_status="Published", teacher_course_status="Published"
        )
        return course


class CartAPIView(generics.CreateAPIView):
    """🧐这个APIView似乎有很大的优化空间,有很多重复的代码"""

    queryset = api_models.Cart.objects.all()
    serializer_class = api_serializer.CartSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        course_id = request.data["course_id"]
        user_id = request.data["user_id"]
        price = request.data["price"]
        country_name = request.data["country_name"]
        cart_id = request.data["cart_id"]

        course = api_models.Course.objects.filter(
            id=course_id
        ).first()  # 🧐这里不需要try except?
        # 答：需要的，课程不存在时要直接返回明确的错误信息，而不是让错误在后续逻辑中暴露
        # 👇 错误处理
        if not course:
            return Response(
                {"message": "Course not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if user_id != "undefined":
            user = User.objects.filter(id=user_id).first()
        else:
            user = None  # 这里当user_id前端传过来“undefined“的时候，user会被赋值为None，但是后续却会使用到user，也就是说，后续会将None作为user使用，这说明支持匿名购物车的功能，详见Cart模型的user字段，null是True，说明确实支持匿名购物车的功能，所以这里当user_id为“undefined“时，也就是在这个else逻辑中，不需要对user进行错误处理
        try:
            country_object = api_models.Country.objects.filter(
                name=country_name
            ).first()
            country = country_object.name
        except:
            country_object = None
            country = "China"

        if country_object:
            tax_rate = country_object.tax_rate / 100
        else:
            tax_rate = 0

        cart = api_models.Cart.objects.filter(cart_id=cart_id, course=course).first()
        if cart:
            cart.course = course
            cart.user = user
            cart.price = price
            cart.tax_fee = Decimal(price) * Decimal(tax_rate)
            cart.country = country
            cart.cart_id = cart_id
            cart.total = Decimal(cart.price) + Decimal(cart.tax_fee)
            cart.save()

            return Response(
                {"message": "Cart Updated Successfully!"}, status=status.HTTP_200_OK
            )
        else:
            cart = api_models.Cart()
            cart.course = course
            cart.user = user
            cart.price = price
            cart.tax_fee = Decimal(price) * Decimal(tax_rate)
            cart.country = country
            cart.cart_id = cart_id
            cart.total = Decimal(cart.price) + Decimal(cart.tax_fee)
            cart.save()
            return Response(
                {"message": "Cart Created Successfully!"},
                status=status.HTTP_201_CREATED,
            )


class CartListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CartSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        cart_id = self.kwargs["cart_id"]
        query_set = api_models.Cart.objects.filter(cart_id=cart_id)
        return query_set


class CartCountAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        cart_id = self.kwargs["cart_id"]
        count = api_models.Cart.objects.filter(cart_id=cart_id).count()
        return Response({"count": count}, status=status.HTTP_200_OK)


class CartItemDeleteAPIView(generics.DestroyAPIView):
    serializer_class = api_serializer.CartSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        """
        🧐为什么这里要写get_object方法而不是destroy方法?

        解答:
        1. DestroyAPIView的工作流程:
           - 当收到DELETE请求时,DestroyAPIView会自动调用get_object()方法获取要删除的对象
           - 然后调用perform_destroy()方法执行删除操作
           - 最后返回HTTP 204 No Content响应

        2. get_object()方法的作用:
           - 这是Django REST framework的标准做法
           - get_object()负责根据URL参数定位要删除的具体对象
           - DestroyAPIView会自动处理删除逻辑,我们只需要告诉它要删除哪个对象

        3. 为什么不直接重写destroy方法:
           - 重写get_object()更符合单一职责原则,只负责对象查找
           - 删除逻辑由父类统一处理,保证了一致性和错误处理
           - 如果需要自定义删除逻辑,可以重写perform_destroy()方法

        4. 这里使用复合主键查找:
           - cart_id: 购物车标识符
           - item_id: 购物车中具体商品的ID(对应Cart模型的主键)

        如果我们这里不重写get_object方法会怎么样?
            如果不重写get_object方法,DestroyAPIView会使用默认的查找逻辑:
            1. 查找失败: 默认的get_object()只会使用主键(pk)从URL中查找对象,而你的URL包含cart_id和item_id两个参数
            2. 抛出异常: 由于无法正确匹配对象,会抛出Http404异常
            3. 删除错误对象: 即使能匹配到对象,也可能删除错误的购物车项,因为没有cart_id的约束条件

            原因:默认实现只使用 self.kwargs['pk'] 或 lookup_field 指定的单一字段查找,无法处理你这种需要多个条件(cart_id + item_id)的复合查找需求。

            重写get_object()是必须的,确保只删除指定购物车中的特定商品。
        """
        cart_id = self.kwargs["cart_id"]
        item_id = self.kwargs["item_id"]

        return api_models.Cart.objects.filter(
            cart_id=cart_id, id=item_id
        ).first()  # 这里的id是隐藏的主键,item_id是浏览器url传递的,详见urls的定义


class CartStatsAPIView(generics.GenericAPIView):
    """
    🧐这个APIView有什么用?

    解答:
    这个APIView是一个购物车统计接口,主要功能是计算并返回指定购物车的统计信息:

    1. 功能作用:
       - 计算购物车中所有商品的总价格(price)
       - 计算购物车中所有商品的总税费(tax)
       - 计算购物车的最终总金额(total)

    2. 使用场景:
       - 前端购物车页面显示总计信息
       - 结算页面显示费用明细
       - 实时更新购物车统计数据

    3. 设计特点:
       - 继承GenericAPIView,提供通用的视图功能基础
       - 使用cart_id作为查找字段,获取特定购物车的数据
       - 返回聚合后的统计数据而不是原始的购物车项列表
    """

    serializer_class = api_serializer.CartSerializer
    permission_classes = [AllowAny]
    # lookup_field: 指定用于查找对象的字段名
    # 🧐这个字段有什么用?
    # 解答:
    # 1. 覆盖默认查找字段: RetrieveAPIView默认使用'pk'作为lookup_field,这里改为使用'cart_id'
    # 2. URL参数映射: 告诉DRF从URL中的cart_id参数来查找对象,而不是默认的pk参数
    # 3. 查找逻辑: 当访问 /api/cart/{cart_id}/stats/ 时,DRF会用cart_id的值去查找对象
    # 4. 配合get_queryset(): 与下面的get_queryset()方法配合,确保查找的是正确的购物车

    """
        这个字段还有用吗？
        答: 没有用。
        原因:
            被重写方法覆盖: CartStatsAPIView 重写了 get() 方法，直接从 request 参数中获取 cart_id,完全绕过了 DRF 的默认查找机制
            不使用 get_object(): 该视图没有调用 get_object() 方法，而 lookup_field 只在 get_object() 中生效
            手动查询：代码中直接使用 api_models.Cart.objects.filter(cart_id=cart_id) 进行查询，不依赖   DRF 的查找字段
            建议：删除 lookup_field = "cart_id" 这行代码，因为它在当前实现中完全没有作用。
    """
    # lookup_field = "cart_id"

    def get(self, request, cart_id):
        """
        🧐这个方法有什么作用呢?帮我解析一下.

        解答:
        这个get方法实现了购物车统计功能:

        1. 方法流程:
           - 获取指定cart_id的所有购物车项(queryset)
           - 遍历每个购物车项,累加价格、税费和总额
           - 返回聚合后的统计数据

        2. 计算逻辑:
           - total_price: 累加所有商品的价格
           - total_tax: 累加所有商品的税费
           - total_total: 累加所有商品的最终金额
           - 使用round()函数保证金额精度为2位小数

        3. 为什么使用GenericAPIView:
           - GenericAPIView提供了基础的API视图功能
           - 不需要特定的CRUD操作,只需要自定义的统计计算
           - 提供了灵活性来实现自定义的响应逻辑

        4. 返回数据格式:
           {"price": 总价格, "tax": 总税费, "total": 总金额}

        5. 使用场景:
           - GET /api/cart/{cart_id}/stats/ 获取购物车统计信息
           - 前端可以实时显示购物车的费用明细
        """
        queryset = api_models.Cart.objects.filter(cart_id=cart_id)
        total_price = 0.00
        total_tax = 0.00
        total_total = 0.00

        for cart_item in queryset:
            total_price += round(float(cart_item.price), 2)
            total_tax += round(float(cart_item.tax_fee), 2)
            total_total += round(float(cart_item.total), 2)

        data = {"price": total_price, "tax": total_tax, "total": total_total}

        return Response(data)


class CreateOrderAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.CartOrderSerializer
    permission_classes = [AllowAny]
    queryset = api_models.CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        full_name = request.data["full_name"]
        email = request.data["email"]
        country = request.data["country"]
        cart_id = request.data["cart_id"]
        user_id = request.data["user_id"]

        if user_id != 0:
            user = User.objects.get(id=user_id)
        else:
            user = None

        # 🧐为什么这里要获取cart_items？
        # 答：因为需要将购物车中的商品转换为订单项。购物车只是临时存储，用户确认购买后
        # 需要创建正式的订单，并将购物车中的每个商品创建为对应的订单项（CartOrderItem）
        cart_items = api_models.Cart.objects.filter(cart_id=cart_id)
        total_price = Decimal(0.00)
        total_tax = Decimal(0.00)
        total_initial_total = Decimal(0.00)
        total_total = Decimal(0.00)

        # 🧐这里在干什么？
        # 答：这里创建一个新的订单对象，包含基本的订单信息（客户姓名、邮箱、国家、用户）
        # 但还没有包含具体的商品信息和金额统计，这些将在下面的循环中补充
        order = api_models.CartOrder.objects.create(
            full_name=full_name, email=email, country=country, student=user
        )

        for item in cart_items:

            # 🧐上面已经创建了一个订单order，为什么这里又要创建CartOrderItem?有什么用？
            # 答：这是订单系统的标准设计模式：
            # - CartOrder（订单头）：存储订单的基本信息（客户信息、总金额等）
            # - CartOrderItem（订单项）：存储订单中每个具体商品的详细信息
            # 一个订单可以包含多个商品，所以需要一对多的关系来存储每个商品的价格、税费等信息

            # 🧐 “一个订单可以包含多个商品” 是不是可以理解为：“一个订单头（ CartOrder ）可以包含多个订单项（ CartOrderItem ）”？
            # 答：是的，完全正确！
            # 这是典型的主从表设计模式：
            # CartOrder（订单头）：存储订单级别的信息（客户姓名、邮箱、总金额等）
            # CartOrderItem（订单项）：存储商品级别的详细信息（具体课程、价格、税费等）
            # 通过order=order建立的外键关系，实现了一对多的关联：一个订单头可以关联多个订单项，这样就能在一次购买中包含多个不同的课程。

            # 说白了，这里就是在创建一个订单中具体的某些课程的信息，因为一个订单中可能有很多的课程，所以需要通过循环来创建，cart_items是从Cart购物车中查询的，而它又需要通过我们传入的具体的cart_id才能查到，你在django admin中也可以看到，一个cart_id可以对应多个课程，其实应该来讲只能有一个cart_id的，因为购物车只有一个
            # 然后购物车里面有很多的课程，当我们选中课程的时候，调用此视图，进行创建订单，然后知道选中了几个课程，订单里就会有几个CartOrderItem，循环也就相应进行几次
            api_models.CartOrderItem.objects.create(
                order=order,
                course=item.course,
                price=item.price,
                tax_fee=item.tax_fee,
                total=item.total,
                initial_total=item.total,
                teacher=item.course.teacher,
            )

            # 因为刚说过，一个订单可能有很多个订单项（多个课程子项，也就是CartOrderItem），所以每个课程的信息，包括价格，税费，总价都要计算
            # 这里用 += 是因为最后要统计到 order 当中
            total_price += Decimal(item.price)
            total_tax += Decimal(item.tax_fee)
            total_initial_total += Decimal(item.total)
            total_total += Decimal(item.total)

            # 这里在干什么？上面的create中已经使用了item.course.teacher和order了，然后这里才来add teacher吗？
            # 还有，add有什么作用？是谁的方法？
            # 答：
            # 1. 上面 CartOrderItem 的 teacher 字段是存储单个订单项对应的老师
            # 2. 这里的order.teacher.add()是将老师添加到订单的多对多关系中
            # 3. add()是Django多对多字段的方法，用于建立多对多关系
            # 4. 目的：一个订单可能包含多个不同老师的课程，所以订单需要记录所有相关的老师
            # 5. 顺序没问题：先创建订单项（存储具体信息），再建立订单与老师的关联关系
            order.teacher.add(item.course.teacher)

        # 🧐为什么下面对order做了这么多的操作，但是上面的循环中已经使用到了order了，顺序是不是反了？
        # 答：顺序是正确的，这是分步骤构建订单的过程：
        # 1. 先创建订单基本信息（客户信息）
        # 2. 循环处理每个购物车项，创建订单项并累加金额
        # 3. 最后将累加的总金额更新到订单对象中
        # 这样设计的好处是：即使中途出错，订单的基本信息已经存在，便于错误处理和调试

        # 🧐为什么要对订单做这么多信息的赋值操作呢？
        # 答：因为我们最终要显示出订单的状态呀，显示总价格，税费什么的，要展示给用户看的。
        order.sub_total = total_price
        order.tax_fee = total_tax
        order.initial_total = total_initial_total
        order.total = total_total
        order.save()

        return Response(
            {"message": "Order Created Successfully!", "order_id": order.cart_order_id},
            status=status.HTTP_201_CREATED,
        )


class CheckoutAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.CartOrderSerializer
    permission_classes = [AllowAny]
    queryset = (
        api_models.CartOrder.objects.all()
    )  # 因为这里的结果集是CartOrder的，所以response中的字段都是CartOrder的字段
    lookup_field = "cart_order_id"


class CouponApplyAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.CouponSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        cart_order_id = request.data["cart_order_id"]
        coupon_code = request.data["coupon_code"]

        try:
            order = get_object_or_404(
                api_models.CartOrder, cart_order_id=cart_order_id
            )  # 通过cart_order_id获取具体的订单,使用 get_object_or_404 ，数据库中找不到当前的对象是会报错404
        except Http404:
            return Response(
                {"message": "当前订单未找到"}, status=status.HTTP_404_NOT_FOUND
            )
        try:
            coupon = get_object_or_404(api_models.Coupon, code=coupon_code)
        except Http404:
            return Response(
                {"message": "当前优惠券未找到"}, status=status.HTTP_404_NOT_FOUND
            )
        try:
            order_items = api_models.CartOrderItem.objects.filter(
                order=order, teacher=coupon.teacher
            )  # 获取所有相同订单的订单项（一个订单里可能有很多个课程）。teacher=coupon.teacher是因为coupon是老师创建的，和老师有关。
        except Http404:
            return Response(
                {"message": "当前订单项未找到"}, status=status.HTTP_404_NOT_FOUND
            )
        for item in order_items:
            if not coupon in item.coupons.all():
                discount = item.total * Decimal(coupon.discount / 100)
                item.total -= discount
                item.price -= discount
                item.saved += discount
                item.applied_coupon = True
                item.coupons.add(
                    coupon
                )  # 将当前的coupon应用到coupons中，表示应用了这个coupon

                order.coupons.add(coupon)
                order.total -= discount
                order.saved += discount

                item.save()
                order.save()

                coupon.used_by.add(order.student)

                return Response(
                    {"message": "Coupon Found and Activated.", "icon": "success"},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"message": "Coupon Already Applied.", "icon": "warning"},
                    status=status.HTTP_201_CREATED,
                )


class StripeCheckoutAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.CartOrderSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        cart_order_id = request.data["cart_order_id"]
        order = api_models.CartOrder.objects.get(cart_order_id=cart_order_id)

        if not order:
            return Response(
                {"message": "Order Not Found"}, status=status.HTTP_404_NOT_FOUND
            )
        try:
            # 🧐这个checkout_session在干什么？CHECKOUT_SESSION_ID是哪来的？
            checkout_session = stripe.checkout.Session.create(
                customer_email=order.email,
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "usd",
                            "product_data": {"name": order.full_name},
                            "unit_amount": int(order.total * 100),
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url=settings.FRONTEND_SITE_URL
                + "/payment-success/"
                + order.cart_order_id
                + "?session_id={CHECKOUT_SESSION_ID}",
                cancel_url=settings.FRONTEND_SITE_URL + "/payment-failed/",
            )
            print("checkout_session:", checkout_session)
            order.stripe_session_id = checkout_session.id

            return redirect(checkout_session.url)
        except stripe.StripeError as e:
            return Response(
                {
                    "message": f"Something went wrong when trying to make payment, Error is:{e}"
                }
            )


class PaymentSuccessAPIView(generics.CreateAPIView):
    # 🧐这个APIView待注释，不是很懂,而且检查stripe和paypal的部分有冗余代码
    serializer_class = api_serializer.CartOrderSerializer
    queryset = api_models.CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        cart_order_id = request.data["cart_order_id"]
        session_id = request.data["session_id"]
        paypal_order_id = request.data["paypal_order_id"]

        order = api_models.CartOrder.objects.get(cart_order_id=cart_order_id)
        order_items = api_models.CartOrderItem.objects.filter(order=order)

        # 通用的支付成功处理逻辑
        def process_payment_success():
            """处理支付成功后的通用逻辑"""
            if order.payment_status == "Processing":
                order.payment_status = "Paid"
                order.save()
                api_models.Notification.objects.create(
                    user=order.student,
                    order=order,
                    type="Course Enrollment Completed",
                )  # 为了通知学生，他们买了一门新课程
                for item in order_items:
                    api_models.Notification.objects.create(
                        teacher=item.teacher,
                        order=order,
                        order_item=item,
                        type="New Order",
                    )
                    # 检查是否已经存在注册记录，避免重复创建
                    existing_enrollment = api_models.EnrolledCourse.objects.filter(
                        course=item.course, user=order.student, order_item=item
                    ).first()

                    if not existing_enrollment:
                        api_models.EnrolledCourse.objects.create(
                            teacher=item.teacher,
                            course=item.course,
                            user=order.student,
                            order_item=item,
                        )
                return Response({"message": "Payment Successful"})
            else:
                return Response({"message": "Already Paid."})

        # Paypal payment success
        if paypal_order_id != "null":
            paypal_api_url = (
                f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{paypal_order_id}"
            )
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {get_access_token(PAYPAL_CLIENT_ID,PAYPAL_SECRET_ID)}",
            }
            response = requests.get(paypal_api_url, headers=headers)

            if response.status_code == 200:
                paypal_order_data = response.json()
                paypay_payment_status = paypal_order_data["status"]
                if paypay_payment_status == "COMPLETED":
                    return process_payment_success()
                else:
                    return Response({"message": "Payment Failed"})
            else:
                return Response({"message": "Paypal Error Occured"})

        # Stripe payment success
        elif session_id != "null":  # 使用elif避免两种支付方式同时执行
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == "paid":
                return process_payment_success()
            else:
                return Response({"message": "Payment Failed"})

        # 如果两种支付方式都没有有效数据
        return Response(
            {"message": "No valid payment information provided"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class SearchCourseAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.GET.get("query")  # 🧐为什么这个request可以直接调用？
        return api_models.Course.objects.filter(
            title__icontains=query,
            platform_status="Published",
            teacher_course_status="Published",
        )


def get_access_token(client_id, secret_key):
    token_url = "https://api.sandbox.paypal.com/v1/oauth2/token"
    data = {"grant_type": "client_credentials"}
    auth = (client_id, secret_key)
    response = requests.post(token_url, data=data, auth=auth)

    if response.status_code == 200:
        print("Access Token =====", response.json()["access_token"])
        return response.json()["access_token"]
    else:
        raise Exception(
            f"Failed to get access token from paypal {response.status_code}"
        )


class StudentSummaryAPIView(generics.ListAPIView):
    serializer_class = api_serializer.StudentSummarySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        try:
            user = get_object_or_404(api_models.User, id=user_id)
        except Http404:
            return Response({"message": "当前用户未找到"})

        total_courses = api_models.EnrolledCourse.objects.filter(user=user).count()
        completed_lessons = api_models.CompletedLesson.objects.filter(user=user).count()
        achieved_certificates = api_models.Certificate.objects.filter(user=user).count()

        return [
            {
                "total_courses": total_courses,
                "completed_lessons": completed_lessons,
                "certification": achieved_certificates,
            }
        ]

    def list(self, request, *args, **kwargs):
        """
        🧐这个方法的作用是什么？是哪个类的方法？
        答：
        1. 这个方法的作用：重写Django REST framework中ListAPIView的list方法，用于处理GET请求并返回列表数据
        2. 这是Django REST framework中ListAPIView类的方法
        3. 当客户端发起GET请求时，会自动调用这个list方法
        4. 原本ListAPIView的list方法是返回模型对象的列表，但这里我们需要返回自定义的统计数据
        5. 所以重写这个方法来返回我们需要的学生统计摘要数据
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(
            queryset, many=True
        )  # 🧐为什么这里要写：many=True?
        # 答：many=True告诉序列化器这是一个对象列表而不是单个对象
        # 但是这里有问题：get_queryset()返回的是Response对象，不是模型对象列表
        # 应该直接返回get_queryset()的结果，因为它已经是格式化好的Response了
        return Response(serializer.data)


class StudentCourseListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.EnrolledCourseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)
        return api_models.EnrolledCourse.objects.filter(user=user)


class StudentCourseDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.EnrolledCourseSerializer
    permission_classes = [AllowAny]
    lookup_field = "enrollment_id"

    def get_object(self):
        user_id = self.kwargs["user_id"]
        enrollment_id = self.kwargs["enrollment_id"]

        try:
            user = get_object_or_404(api_models.User, id=user_id)
        except Http404:
            return Response({"message": "当前用户未找到"})

        return api_models.EnrolledCourse.objects.get(
            user=user, enrollment_id=enrollment_id
        )


class StudentCourseCompletedCreateAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.CompletedLessonSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        user_id = self.request.data["user_id"]
        course_id = self.request.data["course_id"]
        variant_item_id = self.request.data["variant_item_id"]

        user = get_object_or_404(api_models.User, id=user_id)
        course = get_object_or_404(api_models.Course, course_id=course_id)
        variant_item = get_object_or_404(
            api_models.VariantItem, variant_item_id=variant_item_id
        )

        completed_lessons = api_models.CompletedLesson.objects.filter(
            user=user, course=course, variant_item=variant_item
        ).first()  # 🧐这里用get行吗？

        # 如果completed_lessons存在的话，说明已经是标记为完成的状态了，那么触发当前的api视图就要把它从数据库中删去
        if completed_lessons:
            completed_lessons.delete()
            return Response({"message": "当前小节标记为未完成❌"})
        else:
            # 否则，我们就去创建这条记录，也就是将当前的小节：variant_item标记为完成，同时返回一个message提示
            api_models.CompletedLesson.objects.create(
                user=user, course=course, variant_item=variant_item
            )
            return Response({"message": "当前小节标记为完成✅"})


class StudentCourseCompletedSyncAPIView(generics.GenericAPIView):
    """批量同步课程完成状态API"""

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        course_id = request.data.get("course_id")
        completed_variant_ids = request.data.get(
            "completed_variant_ids", []
        )  # 需要标记为完成的variant_item_id列表

        try:
            user = get_object_or_404(api_models.User, id=user_id)
            course = get_object_or_404(api_models.Course, course_id=course_id)

            # 获取该课程的所有VariantItem
            all_variant_items = api_models.VariantItem.objects.filter(
                variant__course=course
            )

            # 获取当前已完成的记录
            current_completed = api_models.CompletedLesson.objects.filter(
                user=user, course=course
            )
            # 获取当前已完成的variant_item_id集合
            # values_list() 是Django ORM的方法，用于从QuerySet中提取特定字段的值
            # 第一个参数 'variant_item__variant_item_id'：指定要提取的字段路径
            #   - 使用双下划线 __ 进行 跨表关联 查询
            #   - variant_item 是 CompletedLesson 模型的外键字段
            #   - variant_item_id 是 VariantItem 模型的字段
            #   - 完整路径表示：获取CompletedLesson关联的VariantItem的variant_item_id字段值

            # 第二个参数 flat=True：将返回结果扁平化
            #   - 如果为False（默认）：返回元组列表 [('id1',), ('id2',), ...]
            #   - 如果为True：返回扁平列表 ['id1', 'id2', ...]
            # set() 将列表转换为集合，用于后续的集合运算（求差集、交集等），提高查找效率
            current_completed_ids = set(
                current_completed.values_list(
                    "variant_item__variant_item_id", flat=True
                )
            )

            # 目标完成状态
            # 将前端传来的completed_variant_ids列表转换为集合
            # 使用set便于与current_completed_ids进行集合运算
            target_completed_ids = set(completed_variant_ids)
            # 需要删除的记录（当前已完成但目标未完成）
            # 例子：current_completed_ids = {'lesson_1', 'lesson_2', 'lesson_3'}
            #       target_completed_ids = {'lesson_1', 'lesson_4', 'lesson_5'}
            #       to_delete_ids = {'lesson_2', 'lesson_3'}  # 数据库中有但前端没有的
            to_delete_ids = current_completed_ids - target_completed_ids

            if to_delete_ids:
                api_models.CompletedLesson.objects.filter(
                    user=user,
                    course=course,
                    variant_item__variant_item_id__in=to_delete_ids,
                ).delete()

            # 需要创建的记录（目标已完成但当前未完成）
            # 例子：current_completed_ids = {'lesson_1', 'lesson_2', 'lesson_3'}
            #       target_completed_ids = {'lesson_1', 'lesson_4', 'lesson_5'}
            #       to_create_ids = {'lesson_4', 'lesson_5'}  # 前端有但数据库中没有的
            to_create_ids = target_completed_ids - current_completed_ids
            if to_create_ids:
                for variant_item_id in to_create_ids:
                    variant_item = get_object_or_404(
                        api_models.VariantItem, variant_item_id=variant_item_id
                    )
                    api_models.CompletedLesson.objects.create(
                        user=user, course=course, variant_item=variant_item
                    )

            return Response(
                {
                    "message": "课程完成状态同步成功",
                    "total_completed": len(target_completed_ids),
                    "deleted_count": len(to_delete_ids),
                    "created_count": len(to_create_ids),
                }
            )

        except Exception as e:
            return Response(
                {"error": f"同步失败: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
            )


class StudentNoteCreateAPIView(generics.ListCreateAPIView):
    """
    使用ListCreateAPIView而不是CreateAPIView的原因：

    1. 功能合并：ListCreateAPIView同时提供GET（列表）和POST（创建）功能
       - GET: 获取当前用户在指定课程中的所有笔记列表
       - POST: 创建新的笔记

    2. RESTful设计：符合REST API设计原则，一个端点处理同一资源的多种操作
       - /notes/ GET -> 获取笔记列表
       - /notes/ POST -> 创建新笔记

    3. 减少端点数量：避免创建两个单独的视图类，简化URL配置

    4. 前端便利性：前端可以在同一个API端点既获取现有笔记又创建新笔记
    """

    serializer_class = api_serializer.NoteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        enrollment_id = self.kwargs["enrollment_id"]
        user = get_object_or_404(api_models.User, id=user_id)

        enrolled = get_object_or_404(
            api_models.EnrolledCourse, user=user, enrollment_id=enrollment_id
        )
        return api_models.Note.objects.filter(user=user, course=enrolled.course)

    def create(self, request, *args, **kwargs):
        user_id = self.kwargs["user_id"]
        enrollment_id = self.kwargs["enrollment_id"]
        title = request.data["title"]
        note = request.data["note"]

        user = get_object_or_404(api_models.User, id=user_id)

        enrolled = get_object_or_404(
            api_models.EnrolledCourse, user=user, enrollment_id=enrollment_id
        )

        # 这里要enrolled.course，而不是直接enrolled，要传递的是enrolled里的course属性，也就是课程，而不是传递一个enrolled对象
        api_models.Note.objects.create(
            user=user, course=enrolled.course, note=note, title=title
        )
        return Response(
            {"message": "创建笔记成功"},
            status=status.HTTP_201_CREATED,
        )


class StudentNoteDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    这个RetrieveUpdateDestroyAPIView会在Swagger中生成4个接口，
    分别是:GET,PUT,PATCH,DELETE，分别对应查询单个笔记、更新笔记、部分更新笔记和删除笔记的功能

    RetrieveUpdateDestroyAPIView 确实会在Swagger中生成4个API接口：

        GET - 获取单个笔记详情

        PUT - 完整更新笔记

        PATCH - 部分更新笔记

        DELETE - 删除笔记

        RetrieveUpdateDestroyAPIView 继承了 UpdateAPIView，而 UpdateAPIView 默认同时支持 PUT 和 PATCH 两种更新方法，所以总共是4个接口而不是3个。
    """

    serializer_class = api_serializer.NoteSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs["user_id"]
        enrollment_id = self.kwargs["enrollment_id"]
        note_id = self.kwargs["note_id"]

        # 直接使用 get_object_or_404，让 DRF 自动处理 Http404 异常
        user = get_object_or_404(api_models.User, id=user_id)
        enrolled = get_object_or_404(
            api_models.EnrolledCourse, user=user, enrollment_id=enrollment_id
        )
        note = get_object_or_404(
            api_models.Note, course=enrolled.course, user=user, note_id=note_id
        )

        return note


class StudentRateCourseCreateAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.ReviewSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        user_id = request.data["user_id"]
        course_id = request.data["course_id"]
        rating = request.data["rating"]
        review = request.data["review"]

        user = get_object_or_404(api_models.User, id=user_id)
        course = get_object_or_404(api_models.Course, course_id=course_id)

        # 这里要enrolled.course，而不是直接enrolled，要传递的是enrolled里的course属性，也就是课程，而不是传递一个enrolled对象
        api_models.Review.objects.create(
            user=user, course=course, rating=rating, review=review, active=True
        )
        return Response(
            {"message": "创建评价成功"},
            status=status.HTTP_201_CREATED,
        )


class StudentRateCourseUpdateAPIView(generics.RetrieveUpdateAPIView):

    serializer_class = api_serializer.ReviewSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs["user_id"]
        review_id = self.kwargs["review_id"]

        user = get_object_or_404(api_models.User, id=user_id)
        return get_object_or_404(api_models.Review, id=review_id, user=user)


class StudentWishListListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = api_serializer.WishlistSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        user = get_object_or_404(api_models.User, id=user_id)

        return api_models.Wishlist.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        user_id = self.kwargs["user_id"]
        course_id = request.data["course_id"]

        user = User.objects.get(id=user_id)
        course = api_models.Course.objects.get(course_id=course_id)

        wishlist = api_models.Wishlist.objects.filter(user=user, course=course).first()
        if wishlist:
            wishlist.delete()
            return Response({"message": "Wishlist Deleted"}, status=status.HTTP_200_OK)
        else:
            api_models.Wishlist.objects.create(user=user, course=course)
            return Response(
                {"message": "Wishlist Created"}, status=status.HTTP_201_CREATED
            )


class QuestionAnswerListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = api_serializer.Question_AnswerSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        course_id = self.kwargs["course_id"]
        course = get_object_or_404(api_models.Course, course_id=course_id)
        return api_models.Question_Answer.objects.filter(course=course)

    def create(self, request, *args, **kwargs):
        user_id = request.data["user_id"]
        course_id = self.kwargs["course_id"]
        title = request.data["title"]
        message = request.data["message"]

        user = get_object_or_404(api_models.User, id=user_id)
        course = get_object_or_404(api_models.Course, course_id=course_id)
        # orm的create本身很少失败，除非是数据库连接出现问题，或者出现完整性约束问题，所以这里其实可以不用使用try-except
        question = api_models.Question_Answer.objects.create(
            user=user, course=course, title=title
        )
        api_models.Question_Answer_Message.objects.create(
            question=question, user=user, course=course, message=message
        )
        return Response(
            {"message": "创建问题和问题消息成功"},
            status=status.HTTP_201_CREATED,
        )


class QuestionAnswerMessageSendAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.Question_Answer_MessageSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        course_id = request.data["course_id"]
        qa_id = request.data["qa_id"]
        user_id = request.data["user_id"]
        message = request.data["message"]

        user = get_object_or_404(api_models.User, id=user_id)
        course = get_object_or_404(api_models.Course, course_id=course_id)
        question = get_object_or_404(api_models.Question_Answer, qa_id=qa_id)
        api_models.Question_Answer_Message.objects.create(
            course=course, user=user, message=message, question=question
        )

        question_serializer = api_serializer.Question_AnswerSerializer(question)
        return Response({"messgae": "消息已发送", "question": question_serializer.data})


# 这个视图由于是返回的老师的统计数据，所以实际上用函数视图就够了，逻辑就是 get_queryset 中的逻辑，否则要像这里一样重写 get_queryset 和 list 方法，反而麻烦了，现在我把它注释掉，该用函数视图。或者，用 APIView 也可以，这样只需重写get方法就行。
# ⚠️ 其实StudentSummary也是一样的问题，由于里面有一些注释，也算是另一种写法，就不改写了，这个老师的视图改写一下，告诉自己有多种写法。
# class TeacherSummaryAPIView(generics.ListAPIView):
#     serializer_class = api_serializer.TeacherSummarySerializer
#     permission_classes = [AllowAny]

#     def get_queryset(self):
#         teacher_id = self.kwargs["teacher_id"]
#         teacher = get_object_or_404(api_models.Teacher, id=teacher_id)

#         one_month_ago = datetime.today() - timedelta(
#             days=28
#         )  # 🧐为什么days=28? 答：28天正好是4周（28÷7=4），比30天更准确地代表一个月的时间，避免月份天数不同的影响
#         total_courses = api_models.Course.objects.filter(teacher=teacher).count()
#         total_revenue = (
#             api_models.CartOrderItem.objects.filter(
#                 teacher=teacher, order__payment_status="Paid"
#             ).aggregate(total_revenue=models.Sum("price"))["total_revenue"]
#             or 0
#         )  # 🧐这里为什么是：total_revenue=？还有这里aggregate的后面的写法都看不懂
#         # 答：aggregate是Django的聚合函数，total_revenue=是给聚合结果起的别名。models.Sum("price")计算price字段的总和。
#         # aggregate返回一个字典，如{"total_revenue": 1000.00}，所以用["total_revenue"]取出具体值。
#         # "or 0"是因为如果没有记录，Sum返回None，这时用0代替
#         monthly_revenue = (
#             api_models.CartOrderItem.objects.filter(
#                 teacher=teacher, order__payment_status="Paid", date__gte=one_month_ago
#             ).aggregate(total_revenue=models.Sum("price"))["total_revenue"]
#             or 0
#         )  # 🧐date__gte是什么？ 答：Django查询语法，gte = Greater Than or Equal，即"大于等于"，date__gte=one_month_ago表示日期大于等于一个月前
#         enrolled_courses = api_models.EnrolledCourse.objects.filter(teacher=teacher)
#         unique_student_ids = set()
#         students = []

#         for course in enrolled_courses:
#             # 🧐这里难道不是:course.user.id? enrolled_courses没有user_id这个属性啊？
#             # 答：Django的外键字段会自动生成一个_id属性，如user外键会有user_id属性直接存储关联对象的ID，
#             # 使用course.user_id比course.user.id更高效，因为前者不需要查询数据库获取User对象
#             if course.user_id not in unique_student_ids:
#                 user = User.objects.get(id=course.user_id)
#                 student = {
#                     "full_name": user.profile.full_name,
#                     "image": user.profile.image.url,  # 🧐profile.image有url属性？ 答：Django的FileField和ImageField都有url属性，返回文件的可访问URL路径
#                     "country": user.profile.country,
#                     "date": course.date,
#                 }
#                 students.append(student)
#                 unique_student_ids.add(course.user_id)

#         return [
#             {
#                 "total_courses": total_courses,
#                 "total_revenue": total_revenue,
#                 "monthly_revenue": monthly_revenue,
#                 "total_students": len(students),
#             }
#         ]

#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()

#         return Response(queryset)


@api_view(("GET",))
def TeacherSummaryAPIView(request, teacher_id):
    teacher = get_object_or_404(api_models.Teacher, id=teacher_id)

    one_month_ago = datetime.today() - timedelta(
        days=28
    )  # 🧐为什么days=28? 答：28天正好是4周（28÷7=4），比30天更准确地代表一个月的时间，避免月份天数不同的影响
    total_courses = api_models.Course.objects.filter(teacher=teacher).count()
    total_revenue = (
        api_models.CartOrderItem.objects.filter(
            teacher=teacher, order__payment_status="Paid"
        ).aggregate(total_revenue=models.Sum("price"))["total_revenue"]
        or 0
    )  # 🧐这里为什么是：total_revenue=？还有这里aggregate的后面的写法都看不懂
    # 答：aggregate是Django的聚合函数，total_revenue=是给聚合结果起的别名。models.Sum("price")计算price字段的总和。
    # aggregate返回一个字典，如{"total_revenue": 1000.00}，所以用["total_revenue"]取出具体值。
    # "or 0"是因为如果没有记录，Sum返回None，这时用0代替
    monthly_revenue = (
        api_models.CartOrderItem.objects.filter(
            teacher=teacher, order__payment_status="Paid", date__gte=one_month_ago
        ).aggregate(total_revenue=models.Sum("price"))["total_revenue"]
        or 0
    )  # 🧐date__gte是什么？ 答：Django查询语法，gte = Greater Than or Equal，即"大于等于"，date__gte=one_month_ago表示日期大于等于一个月前
    enrolled_courses = api_models.EnrolledCourse.objects.filter(teacher=teacher)
    unique_student_ids = set()
    students = []

    for course in enrolled_courses:
        # 🧐这里难道不是:course.user.id? enrolled_courses没有user_id这个属性啊？
        # 答：Django的外键字段会自动生成一个_id属性，如user外键会有user_id属性直接存储关联对象的ID，
        # 使用course.user_id比course.user.id更高效，因为前者不需要查询数据库获取User对象
        if course.user_id not in unique_student_ids:
            user = User.objects.get(id=course.user_id)
            student = {
                "full_name": user.profile.full_name,
                "image": user.profile.image.url,  # 🧐profile.image有url属性？ 答：Django的FileField和ImageField都有url属性，返回文件的可访问URL路径
                "country": user.profile.country,
                "date": course.date,
            }
            students.append(student)
            unique_student_ids.add(course.user_id)

    return Response(
        [
            {
                "total_courses": total_courses,
                "total_revenue": total_revenue,
                "monthly_revenue": monthly_revenue,
                "total_students": len(students),
            }
        ]
    )


class TeacherCourseListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.TeacherCourseListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
        return api_models.Course.objects.filter(teacher=teacher)


class TeacherReviewListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
        return api_models.Review.objects.filter(course__teacher=teacher)


class TeacherReviewDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = api_serializer.ReviewSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        teacher_id = self.kwargs["teacher_id"]
        review_id = self.kwargs["review_id"]
        teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
        # 🧐为什么这里要用get_object_or_404而不是用api_models.Review.objects.filter?

        # 答：因为RetrieveUpdateAPIView需要返回单个对象实例，而不是QuerySet：
        # 1. get_object_or_404()返回单个模型实例，如果不存在则抛出404异常
        # 2. filter()返回QuerySet（即使只有一个结果），需要额外调用.first()或.get()
        # 3. 使用get_object_or_404()更符合DRF的最佳实践，自动处理异常情况
        # 4. 这里需要验证review既属于指定teacher，又匹配指定review_id，get_object_or_404()一次性完成
        return get_object_or_404(
            api_models.Review, course__teacher=teacher, id=review_id
        )


class TeacherStudentsListAPIView(viewsets.ViewSet):

    def list(self, request, teacher_id=None):
        teacher = api_models.Teacher.objects.get(id=teacher_id)

        enrolled_courses = api_models.EnrolledCourse.objects.filter(teacher=teacher)
        unique_student_ids = set()
        students = []

        for course in enrolled_courses:
            if course.user_id not in unique_student_ids:
                user = User.objects.get(id=course.user_id)
                student = {
                    "full_name": user.profile.full_name,
                    "image": user.profile.image.url,
                    "country": user.profile.country,
                    "date": course.date,
                }

                students.append(student)
                unique_student_ids.add(course.user_id)

        return Response(students)


# 🧐为什么这里要用 @api_view ？用generics.RetriveView然后重写get_object方法不可以吗？

# 答：这里使用 @api_view 而不是 generics.RetrieveView 的原因：
# 1. generics.RetrieveView是为检索单个模型实例设计的，需要返回序列化的模型对象
# 2. 这个API返回的是聚合统计数据（按月分组的收入），不是单个Teacher模型实例
# 3. generics.RetrieveView期望有serializer_class，但这里返回的是自定义的字典数据结构
# 4. @api_view更适合返回自定义格式数据，不需要模型序列化，更灵活
# 5. 如果用RetrieveView，需要创建专门的序列化器和可能还需要自定义get_object()，反而更复杂

# 🧐再问：那用generics.ListAPIView是不是也可以呢？


# 答：从技术角度来说可以，但不推荐的原因：
# 1. ListAPIView设计用于返回模型实例列表，期望有queryset和serializer_class
# 2. 这个API返回的是聚合统计数据，不是模型实例列表，语义不匹配
# 3. 需要重写get_queryset()和list()方法，失去了ListAPIView的便利性
# 4. 违反了"选择最适合的工具"原则，@api_view对于返回自定义数据结构更直观
# 5. ListAPIView还会自动应用分页、过滤等功能，对统计数据来说是不必要的
# 总结：虽然技术上可行，但@api_view更简洁明了，符合"简单任务用简单工具"的原则
@api_view(("GET",))
def TeacherAllMonthEarningAPIView(request, teacher_id):
    teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
    # 🧐帮我解释一下monthly_earning_tracker，其中有很多不懂的函数，它们分别在做什么？

    # 答：这是一个复杂的Django ORM查询，逐步解析如下：
    # 1. filter(teacher=teacher, order__payment_status="Paid")
    #    - 筛选属于该教师且订单状态为"已支付"的购物车订单项
    #    - order__payment_status使用双下划线跨表查询，访问关联订单的支付状态
    # 2. .annotate(month=ExtractMonth("date"))
    #    - 为每条记录添加一个名为"month"的计算字段
    #    - ExtractMonth从date字段中提取月份数字(1-12)
    # 3. .values("month")
    #    - 按月份分组，只选择month字段，准备进行分组聚合
    # 4. .annotate(total_earning=models.Sum("price"))
    #    - 对每个月份分组计算price字段的总和，命名为total_earning
    # 5. .order_by("month")
    #    - 按月份排序，确保结果按时间顺序返回
    # 最终返回：[{"month": 1, "total_earning": 1000}, {"month": 2, "total_earning": 1500}, ...]
    # 👉👉👉👉👉👀 具体步骤流程看文档:/Users/huangwenxin/scripts/typoraDocuments/全栈/Python Web开发/React+Django课程管理项目(LMS)/技术课程项目.md -> Django ORM查询 monthly_earning_tracker 详解
    monthly_earning_tracker = (
        api_models.CartOrderItem.objects.filter(
            teacher=teacher, order__payment_status="Paid"
        )
        .annotate(month=ExtractMonth("date"), year=ExtractYear("date"))
        .values("month", "year")
        .annotate(total_earning=models.Sum("price"))
        .order_by("month")
    )
    MONTH_NAMES = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    }

    # 在返回Response前处理数据
    for item in monthly_earning_tracker:
        item["month_name"] = MONTH_NAMES[item["month"]]

    return Response(monthly_earning_tracker)


class TeacherBestSellingCourseAPIView(viewsets.ViewSet):
    """🎯 教师最佳销售课程API视图 - 获取教师所有课程的销售统计数据"""

    def list(self, request, teacher_id=None):
        teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
        courses_with_total_price = []
        courses = api_models.Course.objects.filter(teacher=teacher)

        for course in courses:
            # 🧐为什么是course.enrolledcourse_set？course并没有enrolledcourse也没有enrolledcourse_set这个字段呀？
            # 答：这是Django的反向关系查询机制：
            # 1. 在EnrolledCourse模型中有：course = models.ForeignKey(Course, on_delete=models.CASCADE)
            # 2. Django自动为Course模型创建反向查询管理器：enrolledcourse_set
            # 3. 命名规则：小写的模型名 + _set，所以EnrolledCourse -> enrolledcourse_set
            # 4. 通过这个管理器可以查询到所有购买了该课程的注册记录
            # 5. 相当于：EnrolledCourse.objects.filter(course=course)
            revenue = (
                course.enrolledcourse_set.aggregate(
                    total_price=models.Sum("order_item__price")
                )["total_price"]
                or 0
            )
            # 这个sales是什么意思？
            # 答：sales表示该课程的销售数量，即有多少人购买了这个课程
            # count()统计该课程的注册学习记录数量，每条记录代表一次购买
            sales = course.enrolledcourse_set.count()

            courses_with_total_price.append(
                {
                    "course_image": course.image.url,
                    "course_title": course.title,
                    "revenue": revenue,  # 该课程的总收入
                    "sales": sales,  # 该课程的销售数量
                }
            )
        return Response(courses_with_total_price)


class TeacherCourseOrdersListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CartOrderItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = api_models.Teacher.objects.get(id=teacher_id)

        return api_models.CartOrderItem.objects.filter(teacher=teacher)


class TeacherQuestionAnswerListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.Question_AnswerSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = api_models.Teacher.objects.get(id=teacher_id)
        return api_models.Question_Answer.objects.filter(course__teacher=teacher)


class TeacherCouponListCreateAPIView(generics.ListCreateAPIView):
    """🧐为什么这里要用ListCreateAPIView"""

    serializer_class = api_serializer.CouponSerializer
    permission_classes = [AllowAny]

    # 🧐为什么这里要用get_queryset?
    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
        return api_models.Coupon.objects.filter(teacher=teacher)


class TeacherCouponDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """使用RetrieveUpdateDestroyAPIView是因为教师可以更新，获取，删除优惠券"""

    serializer_class = api_serializer.CouponSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        teacher_id = self.kwargs["teacher_id"]
        coupon_id = self.kwargs["coupon_id"]
        teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
        return get_object_or_404(api_models.Coupon, id=coupon_id, teacher=teacher)


class TeacherNotificationListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
        return api_models.Notification.objects.filter(teacher=teacher, seen=False)


class TeacherNotificationDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = api_serializer.NotificationSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        teacher_id = self.kwargs["teacher_id"]
        notification_id = self.kwargs["notification_id"]
        teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
        return get_object_or_404(
            api_models.Notification, teacher=teacher, id=notification_id
        )


class CourseCreateAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.CourseCreateSerializer
    permission_classes = [AllowAny]
    queryset = (
        api_models.Course.objects.all()
    )  # 为什么这里要加一个queryset？这不是一个 CreateAPIView 吗？

    def perform_create(self, serializer):
        """
        自定义课程创建逻辑
        perform_create是DRF提供的钩子方法，在对象保存前调用
        """
        with transaction.atomic():
            # 从请求数据中获取teacher_id并转换为Teacher对象
            teacher_id = self.request.data.get("teacher")
            if teacher_id:
                try:
                    teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
                    # 保存课程，传递teacher对象
                    course_instance = serializer.save(
                        teacher=teacher,
                        platform_status="Published",
                        teacher_course_status="Published",
                    )
                except api_models.Teacher.DoesNotExist:
                    raise serializers.ValidationError({"teacher": "指定的教师不存在"})
            else:
                course_instance = serializer.save()

            console.print(
                f"Course created with ID: {course_instance.id}, Title: '{course_instance.title}'"
            )

            # 重构后的variant数据处理逻辑
            variant_data = []

            # 首先收集所有variant的标题
            variant_titles = {}
            for key, value in self.request.data.items():
                if key.startswith("variants") and "[variant_title]" in key:
                    # 提取variant索引：variants[0][variant_title] -> 0
                    index = key.split("[")[1].split("]")[0]
                    variant_titles[index] = value
            console.print(f"variant_titles: {variant_titles}")

            # 为每个variant处理其items
            for variant_index, variant_title in variant_titles.items():
                console.print(f"Processing variant {variant_index}: {variant_title}")
                # 收集该variant下的所有items
                items_data = {}  # {item_index: {field_name: value}}

                for key, value in self.request.data.items():
                    # 匹配格式：variants[0][items][0][title]
                    if f"variants[{variant_index}][items]" in key:
                        # 解析item索引和字段名
                        parts = key.split("][")
                        if len(parts) >= 3:
                            item_index = parts[2].split("]")[0]  # 获取item索引
                            field_name = parts[3].split("]")[0]  # 获取字段名

                            if item_index not in items_data:
                                items_data[item_index] = {}
                            items_data[item_index][field_name] = value

                # 转换为列表格式
                item_data_list = []
                for item_index in sorted(items_data.keys()):
                    item_data_list.append(items_data[item_index])

                variant_data.append(
                    {
                        "variant_data": {"title": variant_title},
                        "variant_item_data": item_data_list,
                    }
                )

            console.print(f"Total variants processed: {len(variant_data)}")

            # 处理variant数据（在同一个事务中）
            for data_entry in variant_data:
                variant = api_models.Variant.objects.create(
                    title=data_entry["variant_data"]["title"], course=course_instance
                )

                for item_data in data_entry["variant_item_data"]:
                    preview_value = item_data.get("preview")
                    preview = (
                        bool(strtobool(str(preview_value)))
                        if preview_value is not None
                        else False
                    )

                    api_models.VariantItem.objects.create(
                        variant=variant,
                        title=item_data.get("title"),
                        description=item_data.get("description"),
                        file=item_data.get("file"),
                        preview=preview,
                    )

    def save_nested_data(self, course_instance, serializer_class, data):
        """这是什么方法？自定义的？它在干嘛？"""
        serializer = serializer_class(
            data=data, many=True, context={"course_instance": course_instance}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course_instance)


class CourseUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = api_models.Course.objects.all()
    # 使用完整的CourseSerializer确保返回所有需要的数据
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        teacher_id = self.kwargs["teacher_id"]
        course_id = self.kwargs["course_id"]
        teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
        course = get_object_or_404(
            api_models.Course, course_id=course_id, teacher=teacher
        )
        return course

    def update(self, request, *args, **kwargs):
        """简化的更新方法 - 分离课程基本信息和variants更新"""
        course = self.get_object()
        console.print(f"[UPDATE] 开始更新课程: {course.title}")

        try:
            # 1. 在独立事务中更新课程基本信息
            basic_updated = self.update_course_fields_safe(course, request.data)

            # 2. 在独立事务中更新variants
            variants_updated = self.update_variants_safe(course, request.data)

            console.print(
                f"[UPDATE] 更新完成 - 基本信息: {basic_updated}, variants: {variants_updated}"
            )

            # 3. 返回完整的更新后数据
            return self.get_updated_response(course)

        except Exception as e:
            console.print(f"[UPDATE] 更新失败: {e}")
            return Response(
                {"error": f"更新失败: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
            )

    def update_course_fields(self, course, data):
        """更新课程基本字段"""
        console.print(f"[DEBUG] 开始更新课程字段，课程ID: {course.id}")
        console.print(f"[DEBUG] 课程当前title: '{course.title}'")

        # 打印所有接收到的数据
        for key, value in data.items():
            if not key.startswith("variants"):
                console.print(
                    f"[DEBUG] 接收数据 {key}: '{value}' (类型: {type(value)})"
                )

        updated_fields = []

        # 定义字段映射和验证规则
        field_config = {
            "title": {"required": True, "type": str},
            "description": {"required": False, "type": str},
            "language": {"required": True, "type": str},
            "level": {"required": True, "type": str},
            "price": {"required": False, "type": decimal.Decimal},
            "category": {"required": False, "type": "foreign_key"},
            "teacher": {"required": False, "type": "foreign_key"},
        }

        for field_name, config in field_config.items():
            if field_name not in data:
                console.print(f"[DEBUG] 字段 {field_name} 不在请求数据中")
                continue

            new_value = data[field_name]
            console.print(
                f"[DEBUG] 处理字段 {field_name}, 新值: '{new_value}' (类型: {type(new_value)})"
            )

            # 验证必填字段
            if config["required"] and not new_value:
                console.print(f"[DEBUG] 跳过必填字段 {field_name}，值为空")
                continue

            try:
                # 处理不同类型的字段
                if field_name == "price":
                    new_value = (
                        decimal.Decimal(str(new_value))
                        if new_value
                        else decimal.Decimal("0.00")
                    )
                    console.print(f"[DEBUG] price转换后: {new_value}")
                elif field_name == "category" and new_value:
                    category_obj = get_object_or_404(
                        api_models.Category, id=int(new_value)
                    )
                    console.print(f"[DEBUG] category对象: {category_obj}")
                    new_value = category_obj
                elif field_name == "teacher" and new_value:
                    teacher_obj = get_object_or_404(
                        api_models.Teacher, id=int(new_value)
                    )
                    console.print(f"[DEBUG] teacher对象: {teacher_obj}")
                    new_value = teacher_obj

                # 检查值是否真的改变了
                old_value = getattr(course, field_name)
                console.print(
                    f"[DEBUG] 字段 {field_name} 比较: 旧值='{old_value}' vs 新值='{new_value}'"
                )

                if old_value != new_value:
                    console.print(f"[DEBUG] 字段 {field_name} 值发生变化，准备更新")
                    setattr(course, field_name, new_value)
                    updated_fields.append(field_name)
                    console.print(
                        f"[UPDATE] {field_name}: '{old_value}' -> '{new_value}'"
                    )
                else:
                    console.print(f"[DEBUG] 字段 {field_name} 值无变化，跳过")

            except Exception as e:
                console.print(f"[ERROR] 字段 {field_name} 更新失败: {e}")
                import traceback

                console.print(f"[ERROR] 详细错误: {traceback.format_exc()}")

        # 处理文件字段
        for file_field in ["image", "file"]:
            if file_field in data:
                file_data = data[file_field]
                console.print(
                    f"[DEBUG] 文件字段 {file_field}: '{file_data}' (类型: {type(file_data)})"
                )
                if (
                    file_data
                    and not str(file_data).startswith("http://")
                    and str(file_data) != "null"
                ):
                    setattr(course, file_field, file_data)
                    updated_fields.append(file_field)
                    console.print(f"[UPDATE] {file_field} 已更新")

        # 保存更改
        if updated_fields:
            console.print(f"[DEBUG] 准备保存字段: {updated_fields}")

            # 处理title唯一性约束
            if "title" in updated_fields:
                original_title = course.title
                self.ensure_unique_title(course)
                if course.title != original_title:
                    console.print(
                        f"[DEBUG] title因唯一性约束被修改: '{original_title}' -> '{course.title}'"
                    )

            try:
                # 保存前再次确认字段值
                for field_name in updated_fields:
                    current_value = getattr(course, field_name)
                    console.print(
                        f"[DEBUG] 保存前字段 {field_name} 当前值: '{current_value}'"
                    )

                console.print(
                    f"[DEBUG] 执行 course.save(update_fields={updated_fields})"
                )
                course.save(update_fields=updated_fields)

                # 保存后验证
                course.refresh_from_db()
                for field_name in updated_fields:
                    saved_value = getattr(course, field_name)
                    console.print(
                        f"[DEBUG] 保存后字段 {field_name} 数据库值: '{saved_value}'"
                    )

                console.print(f"[SUCCESS] 基本字段保存成功: {updated_fields}")
                return True

            except Exception as e:
                console.print(f"[ERROR] 保存失败: {e}")
                import traceback

                console.print(f"[ERROR] 保存错误详情: {traceback.format_exc()}")
                return False
        else:
            console.print(f"[DEBUG] 没有字段需要更新")
            return False

    def ensure_unique_title(self, course):
        """确保title的唯一性"""
        original_title = course.title
        counter = 1
        while (
            api_models.Course.objects.filter(title=course.title)
            .exclude(id=course.id)
            .exists()
        ):
            course.title = f"{original_title} ({counter})"
            counter += 1

    def update_course_fields_safe(self, course, data):
        """在独立事务中安全地更新课程基本字段"""
        try:
            with transaction.atomic():
                console.print(f"[SAFE_UPDATE] 开始独立事务更新课程基本信息")
                # 使用更直接的方式更新字段
                result = self.update_course_fields_direct(course, data)
                console.print(f"[SAFE_UPDATE] 课程基本信息独立事务完成: {result}")
                return result
        except Exception as e:
            console.print(f"[SAFE_UPDATE] 课程基本信息更新失败: {e}")
            console.print(f"[SAFE_UPDATE] 错误详情: {traceback.format_exc()}")
            return False

    def update_course_fields_direct(self, course, data):
        """直接更新课程字段，避免Course模型save方法的干扰"""
        console.print(f"[DIRECT] 开始直接更新课程字段，课程ID: {course.id}")

        # 定义需要更新的字段和新值
        update_data = {}

        # 字段映射
        field_mapping = {
            "title": str,
            "description": str,
            "language": str,
            "level": str,
            "price": decimal.Decimal,
        }

        # 处理基本字段
        for field_name, field_type in field_mapping.items():
            if field_name in data:
                new_value = data[field_name]
                if field_name == "price":
                    new_value = (
                        decimal.Decimal(str(new_value))
                        if new_value
                        else decimal.Decimal("0.00")
                    )

                old_value = getattr(course, field_name)
                if str(old_value) != str(new_value):
                    update_data[field_name] = new_value
                    console.print(
                        f"[DIRECT] 字段 {field_name}: '{old_value}' -> '{new_value}'"
                    )

        # 处理外键字段
        if "category" in data and data["category"]:
            try:
                category = api_models.Category.objects.get(id=int(data["category"]))
                if course.category != category:
                    update_data["category"] = category
                    console.print(
                        f"[DIRECT] category: '{course.category}' -> '{category}'"
                    )
            except api_models.Category.DoesNotExist:
                console.print(f"[DIRECT] category {data['category']} 不存在")

        if "teacher" in data and data["teacher"]:
            try:
                teacher = api_models.Teacher.objects.get(id=int(data["teacher"]))
                if course.teacher != teacher:
                    update_data["teacher"] = teacher
                    console.print(
                        f"[DIRECT] teacher: '{course.teacher}' -> '{teacher}'"
                    )
            except api_models.Teacher.DoesNotExist:
                console.print(f"[DIRECT] teacher {data['teacher']} 不存在")

        # 处理文件字段
        for file_field in ["image", "file"]:
            if file_field in data:
                file_data = data[file_field]
                if (
                    file_data
                    and not str(file_data).startswith("http://")
                    and str(file_data) != "null"
                ):
                    update_data[file_field] = file_data
                    console.print(f"[DIRECT] {file_field} 已更新")

        # 如果有需要更新的字段，使用Django的queryset.update()方法
        if update_data:
            console.print(f"[DIRECT] 准备更新字段: {list(update_data.keys())}")

            # 使用queryset.update()直接更新数据库，避免触发save()方法
            api_models.Course.objects.filter(id=course.id).update(**update_data)

            # 刷新course对象
            course.refresh_from_db()

            # 验证更新结果
            for field_name in update_data:
                current_value = getattr(course, field_name)
                console.print(f"[DIRECT] 更新后 {field_name}: '{current_value}'")

            console.print(f"[DIRECT] 直接更新完成: {list(update_data.keys())}")
            return True
        else:
            console.print(f"[DIRECT] 没有字段需要更新")
            return False

    def update_variants_safe(self, course, data):
        """安全地更新variants，不影响课程基本信息"""
        try:
            with transaction.atomic():
                console.print(f"[SAFE_VARIANT] 开始独立事务更新variants")
                result = self.update_variant(course, data)
                console.print(f"[SAFE_VARIANT] variants独立事务完成")
                return result
        except Exception as e:
            console.print(f"[SAFE_VARIANT] variants更新失败，但不影响基本信息: {e}")
            import traceback

            console.print(f"[SAFE_VARIANT] variants错误详情: {traceback.format_exc()}")
            return False

    def get_updated_response(self, course):
        """获取更新后的完整课程数据"""
        # 确保获取最新数据
        course.refresh_from_db()

        # 使用完整的CourseSerializer
        serializer = api_serializer.CourseSerializer(
            course, context={"request": self.request}
        )

        console.print(
            f"[UPDATE] 返回完整数据，variants数量: {course.curriculum().count()}"
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update_variant(self, course, request_data):
        """更新课程variants - 注意：此方法应该在事务中被调用"""
        console.print(f"[UPDATE_VARIANT] 开始处理variants更新")
        console.print(f"[UPDATE_VARIANT] 接收到的数据键: {list(request_data.keys())}")

        # 解析FormData中的variant数据（扁平化格式）
        variant_titles = {}
        for key, value in request_data.items():
            if key.startswith("variants") and "[variant_title]" in key:
                index = key.split("[")[1].split("]")[0]
                variant_titles[index] = value

        console.print(f"[UPDATE_VARIANT] 解析到的variant_titles: {variant_titles}")

        for variant_index, variant_title in variant_titles.items():
            console.print(
                f"[UPDATE_VARIANT] 处理variant {variant_index}: {variant_title}"
            )

            # 获取variant_id（如果存在）
            variant_id_key = f"variants[{variant_index}][variant_id]"
            variant_id = request_data.get(variant_id_key)

            # 收集该variant下的所有items
            items_data = {}
            for key, value in request_data.items():
                if f"variants[{variant_index}][items]" in key:
                    parts = key.split("][")
                    if len(parts) >= 3:
                        item_index = parts[2].split("]")[0]
                        field_name = parts[3].split("]")[0]
                        if item_index not in items_data:
                            items_data[item_index] = {}
                        items_data[item_index][field_name] = value

            item_data_list = []
            for item_index in sorted(items_data.keys()):
                item_data_list.append(items_data[item_index])

            console.print(
                f"[UPDATE_VARIANT] variant_id: {variant_id}, items数量: {len(item_data_list)}"
            )

            existing_variant = None
            if variant_id:
                existing_variant = course.variant_set.filter(id=variant_id).first()

            if existing_variant:
                existing_variant.title = variant_title
                existing_variant.save()
                console.print(
                    f"[UPDATE_VARIANT] 更新现有variant: {existing_variant.title}"
                )

                for item_data in item_data_list:
                    preview_value = item_data.get("preview")
                    preview = (
                        bool(strtobool(str(preview_value)))
                        if preview_value is not None
                        else False
                    )

                    # 查找现有的variant_item
                    variant_item_id = item_data.get("variant_item_id")
                    variant_item = None
                    if variant_item_id:
                        variant_item = api_models.VariantItem.objects.filter(
                            variant_item_id=variant_item_id
                        ).first()

                    title = item_data.get("title")
                    description = item_data.get("description")
                    file_data = item_data.get("file")

                    if variant_item:
                        # 更新现有item
                        variant_item.title = title
                        variant_item.description = description
                        variant_item.preview = preview

                        # 处理文件更新
                        if (
                            file_data
                            and not str(file_data).startswith("http://")
                            and str(file_data) != "null"
                        ):
                            variant_item.file = file_data

                        variant_item.save()
                        console.print(
                            f"[UPDATE_VARIANT] 更新现有item: {variant_item.title}"
                        )
                    else:
                        # 创建新item
                        file_value = (
                            file_data
                            if file_data and str(file_data) != "null"
                            else None
                        )

                        variant_item = api_models.VariantItem.objects.create(
                            variant=existing_variant,
                            title=title,
                            description=description,
                            file=file_value,
                            preview=preview,
                        )
                        console.print(
                            f"[UPDATE_VARIANT] 创建新item: {variant_item.title}"
                        )

            else:
                # 创建新variant
                new_variant = api_models.Variant.objects.create(
                    course=course, title=variant_title
                )
                console.print(f"[UPDATE_VARIANT] 创建新variant: {new_variant.title}")

                for item_data in item_data_list:
                    preview_value = item_data.get("preview")
                    preview = (
                        bool(strtobool(str(preview_value)))
                        if preview_value is not None
                        else False
                    )

                    file_data = item_data.get("file")
                    file_value = (
                        file_data if file_data and str(file_data) != "null" else None
                    )

                    api_models.VariantItem.objects.create(
                        variant=new_variant,
                        title=item_data.get("title"),
                        description=item_data.get("description"),
                        file=file_value,
                        preview=preview,
                    )
                    console.print(
                        f"[UPDATE_VARIANT] 为新variant创建item: {item_data.get('title')}"
                    )

    def save_nested_data(self, course_instance, serializer_class, data):
        serializer = serializer_class(
            data=data, many=True, context={"course_instance": course_instance}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course_instance)


class TeacherCourseDetailAPIView(generics.RetrieveAPIView):

    serializer_class = api_serializer.CourseSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        course_id = self.kwargs["course_id"]
        course = get_object_or_404(
            api_models.Course,
            course_id=course_id,
        )
        return course


class CourseVariantDeleteAPIView(generics.DestroyAPIView):
    serializer_class = api_serializer.VariantSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        variant_id = self.kwargs["variant_id"]
        teacher_id = self.kwargs["teacher_id"]
        course_id = self.kwargs["course_id"]

        teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
        console.print(f"teacher: {teacher}")
        course = get_object_or_404(
            api_models.Course, teacher=teacher, course_id=course_id
        )
        console.print(f"course: {course}")
        return get_object_or_404(
            api_models.Variant, variant_id=variant_id, course=course
        )


class CourseVariantItemDeleteAPIVIew(generics.DestroyAPIView):
    serializer_class = api_serializer.VariantItemSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        variant_id = self.kwargs["variant_id"]
        variant_item_id = self.kwargs["variant_item_id"]
        teacher_id = self.kwargs["teacher_id"]
        course_id = self.kwargs["course_id"]

        teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
        course = get_object_or_404(
            api_models.Course, teacher=teacher, course_id=course_id
        )
        variant = get_object_or_404(
            api_models.Variant, variant_id=variant_id, course=course
        )
        return get_object_or_404(
            api_models.VariantItem, variant=variant, variant_item_id=variant_item_id
        )


class TeacherCourseDeleteAPIView(generics.DestroyAPIView):
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        course_id = self.kwargs["course_id"]
        teacher_id = self.kwargs["teacher_id"]
        teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
        course = get_object_or_404(
            api_models.Course, course_id=course_id, teacher=teacher
        )
        return course
