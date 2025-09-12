from django.db import models
from django.utils.text import slugify
from django.utils import timezone

from userauths.models import User, Profile

from shortuuid.django_fields import ShortUUIDField
from moviepy import VideoFileClip
import math

# 像这里的元组，最外层是元组也可以是列表，但是秉承着元组不可改变的性质，用来当作配置项再合适不过了，所以最外层一般用元组
# 然后里面的一个个元组项，其中元组的第一项会存到数据库当中，也就是对应的default中的值；第二项用于在Django后台管理界面或表单中显示给用户看的友好名称，提升可读性和用户体验。
LANGUAGE = (
    ("Chinese", "Chinese"),  # 第一个值存储到数据库，第二个值显示给用户
    ("English", "English"),
    ("Spanish", "Spanish"),
    ("French", "French"),
    ("Japanese", "Japanese"),
)

LEVEL = (
    ("Beginner", "Beginner"),
    ("Intemediate", "Intemediate"),
    ("Advanced", "Advanced"),
)

TEACHER_STATUS = (
    ("Draft", "Draft"),  # 草稿 - 教师自己设置的状态
    ("Disabled", "Disabled"),  # 禁用 - 教师暂停课程
    ("Published", "Published"),  # 发布 - 教师发布课程
)
PLATFORM_STATUS = (
    ("Review", "Review"),  # 审核中 - 平台正在审核
    ("Disabled", "Disabled"),  # 平台禁用
    ("Rejected", "Rejected"),  # 平台拒绝
    ("Draft", "Draft"),  # 草稿
    ("Published", "Published"),  # 平台通过并发布
)
PAYMENT_STATUS = (
    ("Processing", "Processing"),  # 支付处理中
    ("Paid", "Paid"),  # 已支付
    ("Failed", "Failed"),  # 支付失败
)
RATING = (
    (1, "1 Star"),
    (2, "2 Star"),
    (3, "3 Star"),
    (4, "4 Star"),
    (5, "5 Star"),
)
NOTI_TYPE = (
    ("New Order", "New Order"),
    ("New Review", "New Review"),
    ("New Course Question", "New Course Question"),
    ("Draft", "Draft"),
    ("Course Published", "Course Published"),
    ("Course Enrollment Completed", "Course Enrollment Completed"),
)


class Teacher(models.Model):
    """🎯 教师模型 - 存储教师的个人信息和资料"""

    # 🧐为什么用OneToOne？
    # 答：一个用户只能是一个教师，一个教师也只对应一个用户账号，确保唯一性
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    avatar = models.FileField(
        upload_to="course-file", blank=True, null=True, default="default-user.jpg"
    )
    full_name = models.CharField(max_length=100)
    bio = models.CharField(max_length=100, null=True, blank=True)  # 简介
    twitter = models.URLField(null=True, blank=True)  # 社交媒体链接
    about = models.TextField(null=True, blank=True)  # 详细介绍
    country = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.full_name

    # 🧐写这个方法有什么用？
    # 答：获取这个教师的所有学生（通过购买记录）
    def students(self):
        return CartOrderItem.objects.filter(teacher=self)

    # 🧐写这个方法有什么用？
    # 答：获取这个教师的所有课程
    def courses(self):
        return Course.objects.filter(teacher=self)

    # 🧐写这个方法有什么用？
    # 答：获取这个教师的课程数量（用于统计）
    def review(self):
        return Course.objects.filter(teacher=self).count()


class Category(models.Model):
    """🎯 课程分类模型 - 如"编程"、"设计"、"营销"等"""

    title = models.CharField(max_length=100)
    image = models.FileField(
        upload_to="course-file", default="category.png", null=True, blank=True
    )

    # 🧐slug是什么？
    # 答：URL友好的字符串，如"web-development"，用于SEO友好的网址
    slug = models.SlugField(unique=True, null=True, blank=True)
    active = models.BooleanField(default=True)  # 标识分类是否为激活/有效状态

    class Meta:
        verbose_name_plural = "Category"  # 复数形式显示名称
        ordering = ["title"]  # 按标题排序

    def __str__(self):
        return self.title

    # 🧐写这个方法有什么用？
    # 答：获取这个分类下的所有课程
    def courses(self):
        return Course.objects.filter(category=self)

    def save(self, *args, **kwargs):
        """
        自动生成slug：如果没有slug，就从title自动生成

        这个save方法的作用是:

        在模型类中用于自定义对象保存到数据库前的处理逻辑,比如自动赋值、数据校验等。它会在每次调用.save()时执行。"""
        if not self.slug:
            # "Web Development" -> "web-development"
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Course(models.Model):
    """🎯 课程主模型 - 存储课程的基本信息"""

    # 🧐为什么要和Category外键关联？
    # 答：一个课程属于一个分类，分类可以有多个课程（一对多关系），外键依赖就是一对多的关系。分类是“一”，课程是“多”
    # SET_NULL：分类删除时，课程不删除，只是分类字段设为空
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )

    # 🧐为什么要和Teacher外键关联？
    # 答：一个课程由一个教师创建，教师可以有多个课程
    # CASCADE：教师删除时，其所有课程也删除
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)

    file = models.FileField(upload_to="course-file", null=True, blank=True)  # 课程文件
    image = models.FileField(upload_to="course-file", null=True, blank=True)  # 课程封面
    title = models.CharField(max_length=200, unique=True)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    language = models.CharField(max_length=100, choices=LANGUAGE, default="English")
    level = models.CharField(max_length=100, choices=LEVEL, default="Beginner")

    # 平台状态：平台管理员控制的状态
    platform_status = models.CharField(
        max_length=100, choices=PLATFORM_STATUS, default="Draft"
    )
    # 教师状态：教师自己控制的状态
    teacher_course_status = models.CharField(
        max_length=100, choices=TEACHER_STATUS, default="Draft"
    )

    featured = models.BooleanField(default=False)  # 是否为推荐课程
    course_id = ShortUUIDField(
        unique=True, max_length=20, length=10, alphabet="1234567890"
    )  # 短UUID
    slug = models.SlugField(unique=True, null=True, blank=True)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # 检查是否有指定的update_fields
        update_fields = kwargs.get('update_fields', None)
        
        # 如果是新记录，需要先保存获取pk
        if not self.pk:
            super().save(*args, **kwargs)
            
            # 新记录且没有slug时生成slug
            if not self.slug:
                self.slug = slugify(self.title) + "-" + str(self.course_id)
                # 确保slug的唯一性
                original_slug = self.slug
                counter = 1
                while Course.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                    self.slug = f"{original_slug}-{counter}"
                    counter += 1
                
                # 再次保存以更新slug
                super().save(update_fields=['slug'])
        else:
            # 现有记录：只在没有指定update_fields或slug在update_fields中时处理slug
            if not self.slug and (not update_fields or 'title' in update_fields):
                self.slug = slugify(self.title) + "-" + str(self.course_id)
                # 确保slug的唯一性
                original_slug = self.slug
                counter = 1
                while Course.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                    self.slug = f"{original_slug}-{counter}"
                    counter += 1
                
                # 如果有指定update_fields，添加slug到列表中
                if update_fields:
                    kwargs['update_fields'] = list(update_fields) + ['slug']
            
            # 执行正常保存
            super().save(*args, **kwargs)

    # 🧐写这个方法有什么用？
    # 答：获取购买了这个课程的所有学生
    def students(self):
        return EnrolledCourse.objects.filter(course=self)

    # 🧐写这个方法有什么用？
    # 答：获取这个课程的课程大纲（章节列表）
    def curriculum(self):
        return Variant.objects.filter(course=self)

    # 🧐写这个方法有什么用？
    # 答：获取这个课程的所有讲座/视频
    def lectures(self):
        return VariantItem.objects.filter(variant__course=self)

    # 🧐写这个方法有什么用？
    # 答：计算这个课程的平均评分
    def average_rating(self):
        average_rating = Review.objects.filter(course=self, active=True).aggregate(
            avg_rating=models.Avg("rating")
        )
        return average_rating[
            "avg_rating"
            # 因为得到的是一个键值对，例如：{'avg_rating': 34.35}，所以这里要通过：average_rating["avg_rating"]拿到计算得到的平均分数
        ]

    # 🧐写这个方法有什么用？
    # 答：获取这个课程的评价总数
    def rating_count(self):
        return Review.objects.filter(course=self, active=True).count()

    # 🧐写这个方法有什么用？
    # 答：获取这个课程的所有评价
    def reviews(self):
        return Review.objects.filter(course=self, active=True)

    # 显示当前课程是否已经在指定用户的购物车当中
    def isInCart(self, user):
        """
        检查课程是否在指定用户的购物车中

        Args:
            user: User实例，要检查的用户

        Returns:
            bool: 如果课程在用户购物车中返回True，否则返回False
        """
        if not user or not user.is_authenticated:
            return False
        return Cart.objects.filter(course=self, user=user).exists()

    # 显示当前课程是否在指定用户的Wishlist中
    def isInWishlist(self, user):
        """
        检查课程是否在指定用户的愿望单中

        Args:
            user: User实例，要检查的用户

        Returns:
            bool: 如果课程在用户愿望单中返回True，否则返回False
        """
        if not user or not user.is_authenticated:
            return False
        return Wishlist.objects.filter(course=self, user=user).exists()


class Variant(models.Model):
    """🎯 课程章节模型 - 如"第1章：基础知识"、"第2章：进阶技巧" """

    # 🧐为什么要和Course表外键关联？
    # 答：一个课程可以有多个章节，每个章节属于一个课程
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    title = models.CharField(max_length=1000)  # 章节标题
    variant_id = ShortUUIDField(
        unique=True, length=10, max_length=20, alphabet="1234567890"
    )
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    def variant_items(self):
        """获取这个章节下的所有课时"""
        return VariantItem.objects.filter(variant=self)


class VariantItem(models.Model):
    """🎯 课时/视频模型 - 具体的一节课，如"1.1 什么是Python"、"1.2 安装Python" """

    # 🧐为什么要和 Variant 表外键关联？
    # 答：一个章节可以有多个课时，每个课时属于一个章节
    variant = models.ForeignKey(
        Variant, on_delete=models.CASCADE, related_name="variant_items"
    )

    title = models.CharField(max_length=1000)  # 课时标题
    description = models.TextField(null=True, blank=True)
    file = models.FileField(upload_to="course-file", null=True, blank=True)  # 视频文件

    # 🧐这个field的作用？
    # 答：DurationField存储时间长度，如"00:05:30"（5分钟30秒）
    duration = models.DurationField(null=True, blank=True)

    content_duration = models.CharField(
        max_length=1000, null=True, blank=True
    )  # 格式化的时长显示
    preview = models.BooleanField(default=False)  # 是否允许预览（免费观看）
    variant_item_id = ShortUUIDField(
        unique=True, length=10, max_length=20, alphabet="1234567890"
    )
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.variant.title} - {self.title}"  # "第1章 - Python基础"

    def save(self, *args, **kwargs):
        super().save(
            *args, **kwargs
        )  # 必须要加这一行，否则你在admin页面中添加VariantItemjilu的时候，会添加不了。这行的意思是将记录保存到数据库中。
        """自动计算视频时长"""
        if self.file:
            # 🧐为什么要加path？
            # 答：.path获取文件在磁盘上的实际路径，VideoFileClip需要文件路径而不是Django对象
            clip = VideoFileClip(self.file.path)
            duration_seconds = clip.duration
            minutes, seconds = divmod(
                duration_seconds, 60
            )  # 除法和取余，转换为分钟和秒
            minutes = math.floor(minutes)
            seconds = math.floor(seconds)

            duration_text = f"{minutes}m {seconds}s"  # "5m 30s"
            self.content_duration = duration_text
            super().save(update_fields=["content_duration"])


class Question_Answer(models.Model):
    """🎯 课程问答主题模型 - 学生在课程中提出的问题"""

    # 注意，是问题，它是一个问题模型

    # 🧐为什么要和 Course 表外键关联？
    # 答：问题是针对特定课程的
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    # 🧐为什么要和 User 表外键关联？
    # 答：记录是谁提出的问题
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    title = models.CharField(max_length=1000, null=True, blank=True)  # 问题标题
    qa_id = ShortUUIDField(unique=True, length=10, max_length=20, alphabet="1234567890")
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.course.title}"

    def messages(self):
        """获取这个问题下的所有回复消息"""
        return Question_Answer_Message.objects.filter(question=self)

    def profile(self):
        """获取提问者的个人资料"""
        return Profile.objects.get(user=self.user)

    class Meta:
        ordering = ["-date"]  # 按时间倒序排列，最新的在前


class Question_Answer_Message(models.Model):
    """🎯 问答消息模型 - 问题的具体回复内容"""

    # 🧐为什么要和 Course 表外键关联？
    # 答：方便快速查询某个课程的所有问答消息
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    # 🧐为什么要和 Question_Answer 表外键关联？
    # 答：每条消息属于一个问题主题
    question = models.ForeignKey(Question_Answer, on_delete=models.CASCADE)

    # 🧐为什么要和 User 表外键关联？
    # 答：记录是谁发送的消息（可能是学生、教师或管理员）
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    message = models.TextField(null=True, blank=True)  # 回复内容
    qam_id = ShortUUIDField(
        unique=True, length=10, max_length=20, alphabet="1234567890"
    )
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.course.title}"

    def profile(self):
        return Profile.objects.get(user=self.user)

    class Meta:
        ordering = ["date"]  # 按时间正序，早的回复在前


class Cart(models.Model):
    """🎯 购物车模型 - 用户加入购物车但还未购买的课程"""

    # 🧐为什么要和 Course 表外键关联？
    # 答：记录哪个课程被加入购物车
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    # 🧐为什么要和 User 表外键关联？
    # 答：记录是哪个用户的购物车
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    price = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.00
    )  # 课程价格
    tax_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # 税费
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # 总价
    country = models.CharField(
        max_length=100, null=True, blank=True
    )  # 用户国家（影响税率）
    cart_id = ShortUUIDField(
        length=10, max_length=20, alphabet="1234567890"
    )  # 这里只要cart_id的最大长度不要超过20即可，就算只传递1位都不会报错，但是默认生辰的是6位的。
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.course.title


class CartOrder(models.Model):
    """🎯 订单模型 - 用户购买课程的订单记录"""

    # 🧐为什么要和 User 表外键关联？
    # 答：记录是哪个学生下的订单
    student = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    # 🧐为什么要和 Teacher 表多对多关联？
    # 答：一个订单可能包含多个教师的课程（也就是说，一个订单里可能有很多个课程（我一次买了很多课程），这些课程可能是不同老师的课程，也就是这里所说的 “一个订单可能包含多个教师的课程” ），是一种多对多关系
    teacher = models.ManyToManyField(Teacher, blank=True)

    sub_total = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.00
    )  # 小计
    tax_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # 税费
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # 总计
    initial_total = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.00
    )  # 原价总计
    saved = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.00
    )  # 节省金额（优惠券等）
    payment_status = models.CharField(
        max_length=100, choices=PAYMENT_STATUS, default="Processing"
    )
    full_name = models.CharField(max_length=100, null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    coupons = models.ManyToManyField("api.Coupon", blank=True)  # 使用的优惠券
    stripe_session_id = models.CharField(
        max_length=1000, null=True, blank=True
    )  # Stripe支付会话ID
    cart_order_id = ShortUUIDField(
        unique=True, length=10, max_length=20, alphabet="1234567890"
    )
    date = models.DateTimeField(default=timezone.now)

    def order_items(self):
        """获取这个订单的所有商品项"""
        return CartOrderItem.objects.filter(order=self)

    def __str__(self):
        return self.cart_order_id

    class Meta:
        ordering = ["-date"]


class CartOrderItem(models.Model):
    """🎯 订单商品项模型 - 订单中的每个课程详情"""

    # 🧐为什么要和 CartOrder 表外键关联？
    # 答：每个商品项（订单项）属于一个订单
    order = models.ForeignKey(
        CartOrder, on_delete=models.CASCADE, related_name="orderItem"
    )

    # 🧐为什么要和 Course 表外键关联？
    # 答：记录订单中购买的是哪个课程
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="order_item"
    )

    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)  # 课程的教师
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    initial_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    saved = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    """
    这里使用 Coupon 或 "api.Coupon" 都可以。
    不过使用字符串形式 "api.Coupon" 仍然是推荐做法，因为：
    一致性 - Django官方文档推荐在ForeignKey中使用字符串形式
    防御性编程 - 即使现在没有循环引用，未来代码变更时也不会出问题
    明确性 - 清楚地表明引用的是哪个应用的模型
    所以虽然两种方式都能工作，但字符串形式更符合Django最佳实践。
    
    使用字符串 "api.Coupon" 有好处：
    1. 避免循环引用：如果两个模型相互引用的话，这里直接写模型的类而不是字符串的话，就会出问题
    2. 避免命名冲突
    3. 防止模型在没定义的时候引用
    4. 延迟解析：Django会在所有模型加载完成后再解析字符串引用，避免导入顺序问题
    """
    coupons = models.ManyToManyField("api.Coupon", blank=True)
    applied_coupon = models.BooleanField(default=False)  # 是否使用了优惠券
    cart_order_item_id = ShortUUIDField(
        unique=True, length=10, max_length=20, alphabet="1234567890"
    )
    date = models.DateTimeField(default=timezone.now)

    def order_id(self):
        """返回格式化的订单ID"""
        return f"Order ID #{self.order.cart_order_id}"

    def payment_status(self):
        """返回订单支付状态"""
        return f"{self.order.payment_status}"

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return self.cart_order_item_id


class Certificate(models.Model):
    """🎯 课程证书模型 - 学生完成课程后获得的证书"""

    # 🧐为什么要和 Course 表外键关联？
    # 答：记录证书是哪个课程的
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    # 🧐为什么要和 User 表外键关联？
    # 答：记录证书属于哪个学生
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    certificate_id = ShortUUIDField(
        unique=True, length=10, max_length=20, alphabet="1234567890"
    )
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.course.title


class CompletedLesson(models.Model):
    """🎯 完成课时记录模型 - 追踪学生的学习进度"""

    # 🧐为什么要和 Course 表外键关联？
    # 答：记录在哪个课程中完成的
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    # 🧐为什么要和 User 表外键关联？
    # 答：记录是哪个学生完成的
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    # 🧐为什么要和 VariantItem 表外键关联？
    # 答：记录完成的是哪一个具体的课时
    variant_item = models.ForeignKey(VariantItem, on_delete=models.CASCADE)

    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.course.title


class EnrolledCourse(models.Model):
    """🎯 课程注册模型 - 学生购买课程后的注册记录"""

    # 🧐为什么要和 Course 表外键关联？
    # 答：记录学生注册的是哪个课程
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    # 🧐为什么要和 User 表外键关联？
    # 答：记录是哪个学生注册的
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    # 🧐为什么要和 Teacher 表外键关联？
    # 答：方便查询当前这个注册记录中对应课程的某个教师的所有学生
    teacher = models.ForeignKey(
        Teacher, on_delete=models.SET_NULL, null=True, blank=True
    )

    # 🧐为什么要和 CartOrderItem 表外键关联？
    # 答：关联购买记录，证明学生确实购买了这个课程
    order_item = models.ForeignKey(CartOrderItem, on_delete=models.CASCADE)

    enrollment_id = ShortUUIDField(
        unique=True, length=10, max_length=20, alphabet="1234567890"
    )
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.course.title

    def lectures(self):
        """获取课程的所有课时"""
        # 🧐为什么这里要用：variant__course？
        # 答：Django的双下划线语法，跨表查询：VariantItem -> Variant -> Course。也就是VariantItem的外键是variant，和Variant表关联，而Variant表又和Course表关联，所以通过variant__course就能查到对应的课程是什么
        return VariantItem.objects.filter(variant__course=self.course)

    def completed_lesson(self):
        """获取学生在这个课程中完成的所有课时"""
        return CompletedLesson.objects.filter(course=self.course, user=self.user)

    def curriculum(self):
        """获取课程的章节大纲"""
        return Variant.objects.filter(course=self.course)

    def note(self):
        """获取学生在这个课程中的所有笔记"""
        return Note.objects.filter(course=self.course, user=self.user)

    def question_answer(self):
        """获取这个课程的所有问答"""
        return Question_Answer.objects.filter(course=self.course)

    def review(self):
        """获取学生对这个课程的评价"""
        # 🧐这里为什么要用first？
        # 答：一个学生对一个课程只能有一个评价，first()返回第一个匹配的记录
        return Review.objects.filter(course=self.course, user=self.user).first()


class Note(models.Model):
    """🎯 学习笔记模型 - 学生在学习过程中记录的笔记"""

    # 🧐为什么要和 Course 表外键关联？
    # 答：笔记是针对特定课程的
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    # 🧐为什么要和 User 表外键关联？
    # 答：记录是哪个学生的笔记
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    title = models.CharField(max_length=1000, null=True, blank=True)  # 笔记标题
    date = models.DateTimeField(default=timezone.now)
    note = models.TextField()  # 笔记内容
    note_id = ShortUUIDField(
        unique=True, length=10, max_length=20, alphabet="1234567890"
    )

    def __str__(self):
        return self.title


class Review(models.Model):
    """🎯 课程评价模型 - 学生对课程的评分和评论"""

    # 🧐为什么要和 Course 表外键关联？
    # 答：评价是针对特定课程的
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    # 🧐为什么要和 User 表外键关联？
    # 答：记录是哪个学生写的评价
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    date = models.DateTimeField(default=timezone.now)
    review = models.TextField()  # 评价内容
    rating = models.IntegerField(choices=RATING, default=None)  # 评分（1-5星）
    reply = models.CharField(max_length=1000, null=True, blank=True)  # 教师回复
    active = models.BooleanField(default=False)  # 是否显示（需要审核）

    def __str__(self):
        return self.course.title

    def profile(self):
        """获取评价者的个人资料"""
        return Profile.objects.get(user=self.user)


class Notification(models.Model):
    """🎯 通知模型 - 系统通知消息"""

    # 🧐为什么要和 User 表外键关联？
    # 答：记录通知发给哪个用户
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    # 🧐为什么要和 Teacher 表外键关联？
    # 答：有些通知是发给教师的（如新订单、新评价）
    teacher = models.ForeignKey(
        Teacher, on_delete=models.SET_NULL, null=True, blank=True
    )

    # 🧐为什么要和 CartOrder 表外键关联？
    # 答：订单相关的通知需要引用订单
    order = models.ForeignKey(
        CartOrder, on_delete=models.SET_NULL, null=True, blank=True
    )

    # 🧐为什么要和 CartOrderItem 表外键关联？
    # 答：具体到某个课程的订单通知
    order_item = models.ForeignKey(
        CartOrderItem, on_delete=models.SET_NULL, null=True, blank=True
    )

    # 🧐为什么要和 Review 表外键关联？
    # 答：评价相关的通知需要引用评价
    review = models.ForeignKey(Review, on_delete=models.SET_NULL, null=True, blank=True)

    type = models.CharField(
        max_length=100, choices=NOTI_TYPE, default="Draft"
    )  # 通知类型
    seen = models.BooleanField(default=False)  # 是否已读
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.type


class Coupon(models.Model):
    """🎯 优惠券模型 - 教师创建的课程优惠券"""

    # 🧐为什么要和 Teacher 表外键关联？
    # 答：优惠券是由教师创建的，用于自己的课程
    teacher = models.ForeignKey(
        Teacher, on_delete=models.SET_NULL, null=True, blank=True
    )

    # 🧐为什么要和 User 表多对多关联？null可以为True吗？
    # 答：记录哪些用户使用过这个优惠券。ManyToMany不能设置null=True，blank=True就够了
    used_by = models.ManyToManyField(User, blank=True)

    code = models.CharField(max_length=50)  # 优惠券代码，如"SAVE20"
    discount = models.IntegerField(default=1)  # 折扣百分比
    date = models.DateTimeField(default=timezone.now)
    active = models.BooleanField(default=False)  # 是否激活

    def __str__(self):
        return self.code


class Wishlist(models.Model):
    """🎯 愿望清单模型 - 用户收藏的课程"""

    # 🧐为什么要和 Course 表外键关联？
    # 答：记录收藏的是哪个课程
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    # 🧐为什么要和 User 表外键关联？
    # 答：记录是哪个用户的愿望清单
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)


class Country(models.Model):
    """🎯 国家模型 - 存储不同国家的税率信息"""

    name = models.CharField(max_length=100)  # 国家名称
    tax_rate = models.IntegerField(default=5)  # 税率百分比
    active = models.BooleanField(default=True)  # 是否启用

    def __str__(self):
        return self.name


# 🎯 总结：这是一个完整的在线教育平台的数据模型
# 主要包含：用户管理、课程管理、订单系统、学习进度追踪、评价系统、通知系统等功能
# 核心流程：教师创建课程 -> 学生购买 -> 注册学习 -> 完成课时 -> 获得证书 -> 评价课程
