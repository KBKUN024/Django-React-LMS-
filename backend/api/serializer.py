from dataclasses import field
from email.policy import default
from requests import Response
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rich.console import Console

from userauths.models import User, Profile
from django.contrib.auth.password_validation import validate_password

from api import models as api_models


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """自定义JWT令牌序列化器

    继承自TokenObtainPairSerializer，用于在JWT令牌中添加额外的用户信息。
    当用户登录时，除了标准的JWT载荷外，还会包含用户的详细信息。
    """

    @classmethod
    def get_token(cls, user):
        """生成包含自定义用户信息的JWT令牌

        Args:
            user: 用户对象，来自于用户登录认证过程。当用户使用用户名/密码
                 成功登录时，Django认证系统会返回对应的User实例

        Returns:
            token: 包含用户信息的JWT令牌对象

        工作流程：
        1. 调用父类方法生成标准JWT令牌
        2. 在令牌载荷中添加用户的自定义信息
        3. 返回增强后的令牌
        """
        # 调用父类的get_token方法，生成标准的JWT令牌
        # 这会创建包含用户ID、过期时间等标准字段的令牌
        token = super().get_token(user)

        # 在JWT令牌的载荷(payload)中添加自定义字段
        # 这些信息会被编码到JWT令牌中，前端可以解码获取
        token["full_name"] = user.full_name  # 用户全名
        token["username"] = user.username  # 用户名
        token["email"] = user.email  # 邮箱地址

        # 安全地获取教师ID
        # 使用try-except是因为不是所有用户都是教师
        # 如果用户没有关联的Teacher对象，会抛出AttributeError
        try:
            token["teacher_id"] = user.teacher.id  # 教师ID（如果用户是教师）
        except:
            token["teacher_id"] = 0  # 非教师用户的teacher_id设为0

        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Password didn't match!"})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            full_name=validated_data["full_name"], email=validated_data["email"]
        )
        email_username, _ = user.email.split("@")
        user.username = email_username
        user.set_password(validated_data["password"])
        user.save()
        return user

    class Meta:
        model = User
        fields = ["full_name", "email", "password", "password2"]


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = "__all__"


# ---------------------------------------
class TeacherSerializer(serializers.ModelSerializer):
    """你可以很明显的看到,在models中,一些模型是有很多自定义函数的
    这些函数也要写到下面的fields中,如果不写,可以单拎出来,写到外面,
    它也会被自动加入到Meta的fields中
    """

    # 🧐为什么要添加这些字段？
    # 答：Teacher模型中的students()、courses()、review()方法返回的是QuerySet或数字，
    # 需要明确指定为只读字段，避免序列化时出现JSON不可序列化的错误
    students = serializers.SerializerMethodField()  # 教师的学生购买记录（自定义方法）
    courses = serializers.SerializerMethodField()  # 教师的课程（自定义方法）
    review = serializers.IntegerField(read_only=True)  # 课程数量（数字）
    user = UserSerializer(many=False)

    class Meta:
        model = api_models.Teacher
        fields = [
            "user",
            "avatar",
            "full_name",
            "bio",
            "twitter",
            "about",
            "country",
            "students",
            "courses",
            "review",
        ]

    def get_students(self, obj):
        """获取教师的学生购买记录列表（简化版）"""
        students = obj.students()
        return [
            {
                "cart_order_item_id": student.cart_order_item_id,
                "course_name": student.course.title,
                "price": student.price,
                "date": student.date,
            }
            for student in students
        ]

    def get_courses(self, obj):
        """获取教师的课程列表（简化版，避免循环引用）"""
        # 🧐为什么不直接用CourseSerializer？
        # 答：避免循环引用（CourseSerializer包含TeacherSerializer，TeacherSerializer又包含CourseSerializer）
        courses = obj.courses()
        return [
            {
                "course_id": course.course_id,
                "title": course.title,
                "price": course.price,
                "slug": course.slug,
            }
            for course in courses
        ]


class CategorySerializer(serializers.ModelSerializer):
    # 如果需要显示课程列表，使用简化的课程信息避免循环引用
    courses = serializers.SerializerMethodField()

    class Meta:
        model = api_models.Category
        fields = [
            "id",
            "title",
            "image",
            "slug",
            "active",
            "courses",
        ]

    def get_courses(self, obj):
        """获取分类下的课程列表（简化版，避免循环引用）"""
        courses = obj.courses()
        return [
            {
                "course_id": course.course_id,
                "title": course.title,
                "price": course.price,
                "slug": course.slug,
                "image": course.image.url if course.image else None,
                "level": course.level,
                "language": course.language,
            }
            for course in courses
        ]


class VariantItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = api_models.VariantItem
        fields = [
            "id",
            "variant",
            "title",
            "description",
            "file",
            "duration",
            "content_duration",
            "preview",
            "variant_item_id",
            "date",
        ]


class VariantSerializer(serializers.ModelSerializer):
    variant_items = VariantItemSerializer(
        many=True
    )  # 实际上,这个field会自动加入到下面的Meta的fields中

    class Meta:
        model = api_models.Variant
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class Question_Answer_MessageSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(many=False)

    class Meta:
        model = api_models.Question_Answer_Message
        fields = "__all__"


class Question_AnswerSerializer(serializers.ModelSerializer):
    messages = Question_Answer_MessageSerializer(many=True)
    profile = ProfileSerializer(many=False)  # 🧐为什么这里是False？
    # 答：因为一个问答(Question_Answer)只关联一个用户的个人资料(Profile)，这是一对一的关系
    # many=False表示序列化单个Profile对象，而不是Profile对象列表
    # 如果设置many=True，DRF会期望这个字段是一个Profile对象的列表，但实际上Question_Answer模型中的user字段只指向一个用户
    # 所以这里必须使用many=False来正确序列化单个Profile对象

    class Meta:
        model = api_models.Question_Answer
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class CertificateSerializer(serializers.ModelSerializer):

    class Meta:
        model = api_models.Certificate
        fields = "__all__"


class NoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = api_models.Note
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer(
        many=False
    )  # many=False表示一个Review对象只关联一个Profile对象，这是一对一的关系。如果是many=True，则表示一个Review关联多个Profile，但在评论系统中，每个评论只属于一个用户的profile，所以使用many=False

    class Meta:
        model = api_models.Review
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(ReviewSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = api_models.Notification
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class CouponSerializer(serializers.ModelSerializer):

    class Meta:
        model = api_models.Coupon
        fields = "__all__"


class CountrySerializer(serializers.ModelSerializer):

    class Meta:
        model = api_models.Country
        fields = "__all__"


class TeacherCourseListSerializer(serializers.ModelSerializer):
    # 自定义复杂字段的序列化
    teacher = serializers.SerializerMethodField()
    lectures_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = api_models.Course
        fields = [
            "id",
            "course_id",
            "image",
            "language",
            "level",
            "title",
            "teacher",
            "price",
            "lectures_count",
            "platform_status",
            "teacher_course_status",
            "date",
        ]

    def get_teacher(self, obj):
        """返回简化的教师信息"""
        if obj.teacher:
            return {
                "id": obj.teacher.id,
            }
        return None
    
    def get_lectures_count(self, obj):
        """返回讲座总数"""
        return obj.lectures().count()

    def get_image(self, obj):
        """返回图片URL"""
        if obj.image:
            return obj.image.url
        return None


class CourseSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(many=False)  # 🧐为什么这里要这样？
    # 答：many=False是正确的，因为一个课程只属于一个教师(一对一关系)。
    # Course模型中teacher字段是外键，指向Teacher模型，每个课程只有一个教师，
    # 所以需要many=False来序列化单个教师的完整信息，而不是返回教师ID数字。

    students = serializers.SerializerMethodField()  # 🧐为什么这里要这样？
    # 答：many=True是正确的，因为一个课程可以有多个学生注册(一对多关系)。
    # EnrolledCourse模型中course字段是外键，指向Course模型，所以从Course角度看，
    # 它有多个相关的EnrolledCourse记录，因此需要many=True来序列化多个学生的注册信息。

    curriculum = VariantSerializer(many=True, required=False)

    lectures = serializers.SerializerMethodField()  # 🧐为什么这里要这样？
    # 答：many=True是正确的，因为一个课程包含多个讲座/课时。
    # lectures字段代表课程的所有视频课时，一个Course对应多个VariantItem(视频课时)，
    # 这是一对多关系，所以需要many=True来序列化多个讲座内容。

    average_rating = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, required=False)
    rating_count = serializers.IntegerField(required=False)
    isInCart = serializers.SerializerMethodField()
    isInWishlist = serializers.SerializerMethodField()

    def get_students(self, obj):
        students = obj.students()
        return [
            {
                "username": student.user.username,
                "full_name": student.user.full_name,
                "email": student.user.email,
            }
            for student in students
        ]

    def get_lectures(self, obj):
        lectures = obj.lectures()
        # 返回简化的讲座数据，避免过深的嵌套
        return [
            {
                "id": item.id,
                "title": item.title,
                "description": item.description,
                "file": item.file.url if item.file else None,
                "duration": str(item.duration) if item.duration else None,
                "content_duration": item.content_duration,
                "preview": item.preview,
                "variant_item_id": item.variant_item_id,
                "date": item.date,
            }
            for item in lectures
        ]

    def get_average_rating(self, obj):
        average_rating = obj.average_rating()
        return average_rating

    def get_isInCart(self, obj):
        """获取课程是否在当前用户的购物车中"""
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            return obj.isInCart(request.user)
        return False

    def get_isInWishlist(self, obj):
        """获取课程是否在当前用户的愿望单中"""
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            return obj.isInWishlist(request.user)
        return False

    def get_reviews(self, obj):
        reviews = obj.reviews()
        # 返回简化的评价数据，避免循环引用
        return [
            {
                "id": review.id,
                "user": {
                    "id": review.user.id if review.user else None,
                    "username": review.user.username if review.user else None,
                    "full_name": review.user.full_name if review.user else None,
                },
                "date": review.date,
                "review": review.review,
                "rating": review.rating,
                "reply": review.reply,
                "active": review.active,
                "profile": (
                    {
                        "full_name": (
                            review.profile().full_name if review.user else None
                        ),
                        "image": (
                            review.profile().image.url
                            if review.user and review.profile().image
                            else None
                        ),
                    }
                    if review.user
                    else None
                ),
            }
            for review in reviews
        ]

    class Meta:
        model = api_models.Course
        fields = [
            "id",
            "category",
            "teacher",
            "file",
            "image",
            "title",
            "description",
            "price",
            "language",
            "level",
            "platform_status",
            "teacher_course_status",
            "featured",
            "course_id",
            "slug",
            "date",
            "students",
            "curriculum",
            "lectures",
            "average_rating",
            "rating_count",
            "reviews",
            "isInCart",
            "isInWishlist",
        ]


class CartSerializer(serializers.ModelSerializer):
    course = CourseSerializer(many=False)

    class Meta:
        model = api_models.Cart
        fields = "__all__"


class CartOrderItemSerializer(serializers.ModelSerializer):
    course = CourseSerializer(many=False)

    class Meta:
        model = api_models.CartOrderItem
        fields = "__all__"


class CartOrderSerializer(serializers.ModelSerializer):
    order_items = CartOrderItemSerializer(many=True)

    class Meta:
        model = api_models.CartOrder
        fields = "__all__"


class StudentSummarySerializer(serializers.Serializer):
    """
    学生统计摘要序列化器

    与ModelSerializer的区别：
    1. ModelSerializer：基于Django模型自动生成字段，用于序列化模型实例
    2. Serializer：手动定义字段，用于序列化自定义数据结构（如统计数据、聚合结果等）

    这里使用普通Serializer是因为返回的是统计数据而非模型实例
    """

    total_courses = serializers.IntegerField(default=0)  # 学生总课程数
    completed_lessons = serializers.IntegerField(default=0)  # 已完成课时数
    achieved_certificates = serializers.IntegerField(default=0)  # 获得证书数


class TeacherSummarySerializer(serializers.Serializer):
    total_courses = serializers.IntegerField(default=0)
    total_students = serializers.IntegerField(default=0)
    total_revenue = serializers.IntegerField(default=0)
    monthly_revenue = serializers.IntegerField(default=0)


class CompletedLessonSerializer(serializers.ModelSerializer):
    variant_item = VariantItemSerializer(many=False)

    class Meta:
        model = api_models.CompletedLesson
        fields = "__all__"


class EnrolledCourseSerializer(serializers.ModelSerializer):
    lectures = VariantItemSerializer(many=True, read_only=True)
    completed_lesson = CompletedLessonSerializer(many=True, read_only=True)
    curriculum = VariantSerializer(many=True, read_only=True)
    note = NoteSerializer(many=True, read_only=True)
    question_answer = Question_AnswerSerializer(many=True, read_only=True)
    review = ReviewSerializer(
        many=False, read_only=True
    )  # 修改为many=False，因为review()方法返回单个对象
    course = CourseSerializer(many=False)
    # user = UserSerializer(many=False)
    teacher = TeacherSerializer(many=False)

    class Meta:
        model = api_models.EnrolledCourse
        fields = "__all__"


class WishlistSerializer(serializers.ModelSerializer):
    course = CourseSerializer(many=False)

    class Meta:
        model = api_models.Wishlist
        fields = "__all__"


class CourseCreateSerializer(serializers.ModelSerializer):
    """专门用于课程创建的序列化器"""

    class Meta:
        model = api_models.Course
        fields = [
            "category",
            "teacher",
            "title",
            "description",
            "price",
            "language",
            "level",
            "image",
            "file",
        ]

    def create(self, validated_data):
        """自定义创建方法，处理teacher字段"""
        return api_models.Course.objects.create(**validated_data)


class CourseUpdateSerializer(serializers.ModelSerializer):
    """
    简化的课程更新序列化器，主要用于数据返回
    实际的更新逻辑在APIView中处理
    """

    class Meta:
        model = api_models.Course
        fields = [
            "category",
            "teacher",
            "title",
            "description",
            "price",
            "language",
            "level",
            "image",
            "file",
            "course_id",
            "platform_status",
            "teacher_course_status",
        ]
