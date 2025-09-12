from api import views as api_views
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Authentication Endpoints (涉及到身份验证的路由) 👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈
    path("user/token/", api_views.MyTokenObtainPairView.as_view()),
    path("user/token/refresh/", TokenRefreshView.as_view()),  # 刷新token
    path("user/register/", api_views.RegisterView.as_view()),  # 注册
    path(
        "user/profile/<user_id>/", api_views.ProfileView.as_view()
    ),  # 获取用户的profile
    path(
        "user/password-reset/<email>/",
        api_views.PasswordResetVerifyAPIView.as_view(),
    ),  # 重制密码，前端会收到一个重置密码的link
    path("user/password-change/", api_views.PasswordChangeAPIView.as_view()),
    path("user/change-password/", api_views.ChangePasswordAPIView.as_view()),
    # Core Endpoints 👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈
    path("course/category/", api_views.CategoryListAPIView.as_view()),
    path("course/course-list/", api_views.CourseListAPIView.as_view()),
    path(
        "course/search/",
        api_views.SearchCourseAPIView.as_view(),
    ),
    path("course/course-detail/<slug>", api_views.CourseDetailAPIView.as_view()),
    path("cart/add-cart/", api_views.CartAPIView.as_view()),
    path("cart/cart-list/<cart_id>", api_views.CartListAPIView.as_view()),
    path(
        "cart/cart-item-delete/<cart_id>/<item_id>/",
        api_views.CartItemDeleteAPIView.as_view(),
    ),
    path(
        "cart/cart-count/<cart_id>/",
        api_views.CartCountAPIView.as_view(),
    ),
    path(
        "cart/stats/<cart_id>/",
        api_views.CartStatsAPIView.as_view(),
    ),
    path(
        "order/create-order/",
        api_views.CreateOrderAPIView.as_view(),
    ),
    path(
        "order/checkout/<cart_order_id>/",
        api_views.CheckoutAPIView.as_view(),
    ),
    path(
        "order/coupon/",
        api_views.CouponApplyAPIView.as_view(),
    ),
    path(
        "payment/stripe-checkout/<cart_order_id>/",
        api_views.StripeCheckoutAPIView.as_view(),
    ),
    path(
        "payment/payment-success/",
        api_views.PaymentSuccessAPIView.as_view(),
    ),
    # Student Endpoint  👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈
    path(
        "student/summary/<user_id>/",
        api_views.StudentSummaryAPIView.as_view(),
    ),
    path(
        "student/course-list/<user_id>/",
        api_views.StudentCourseListAPIView.as_view(),
    ),
    path(
        "student/course-detail/<user_id>/<enrollment_id>/",
        api_views.StudentCourseDetailAPIView.as_view(),
    ),
    path(
        "student/course-completed/",
        api_views.StudentCourseCompletedCreateAPIView.as_view(),
    ),
    path(
        "student/course-completed-sync/",
        api_views.StudentCourseCompletedSyncAPIView.as_view(),
    ),
    path(
        "student/course-note/<user_id>/<enrollment_id>/",
        api_views.StudentNoteCreateAPIView.as_view(),
    ),
    path(
        "student/course-note-detail/<user_id>/<enrollment_id>/<note_id>/",
        api_views.StudentNoteDetailAPIView.as_view(),
    ),
    path(
        "student/rate-course/",
        api_views.StudentRateCourseCreateAPIView.as_view(),
    ),
    path(
        "student/review-detail/<user_id>/<review_id>/",
        api_views.StudentRateCourseUpdateAPIView.as_view(),
    ),
    path(
        "student/wish_list/<user_id>/",
        api_views.StudentWishListListCreateAPIView.as_view(),
    ),
    path(
        "student/question-answer-list-create/<course_id>/",
        api_views.QuestionAnswerListCreateAPIView.as_view(),
    ),
    path(
        "student/question-answer-message-create/",
        api_views.QuestionAnswerMessageSendAPIView.as_view(),
    ),
    # Teacher Endpoints  👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈
    path("teacher/summary/<teacher_id>/", api_views.TeacherSummaryAPIView),
    path(
        "teacher/course-list/<teacher_id>/",
        api_views.TeacherCourseListAPIView.as_view(),
    ),
    path(
        "teacher/review-list/<teacher_id>/",
        api_views.TeacherReviewListAPIView.as_view(),
    ),
    path(
        "teacher/review-detail/<teacher_id>/<review_id>/",
        api_views.TeacherReviewDetailAPIView.as_view(),
    ),
    path(
        "teacher/student-list/<teacher_id>/",
        api_views.TeacherStudentsListAPIView.as_view({"get": "list"}),
    ),
    # 解释：这里使用{"get": "list"}是因为TeacherStudentsListAPIView继承自ViewSet
    # ViewSet需要手动将HTTP方法映射到具体的action方法
    # {"get": "list"}表示当收到GET请求时，调用ViewSet中的list方法
    # 如果是继承自generics.ListAPIView，则不需要这种映射，直接.as_view()即可
    # ViewSet的优势是可以在一个类中处理多个相关的action，但需要显式声明HTTP方法映射
    path(
        "teacher/all-months-earning/<teacher_id>/",
        api_views.TeacherAllMonthEarningAPIView,
    ),
    path(
        "teacher/best-course-selling/<teacher_id>/",
        api_views.TeacherBestSellingCourseAPIView.as_view({"get": "list"}),
    ),
    path(
        "teacher/course-order-list/<teacher_id>/",
        api_views.TeacherCourseOrdersListAPIView.as_view(),
    ),
    path(
        "teacher/question-answer-list/<teacher_id>/",
        api_views.TeacherQuestionAnswerListAPIView.as_view(),
    ),
    path(
        "teacher/coupon-list/<teacher_id>/",
        api_views.TeacherCouponListCreateAPIView.as_view(),
    ),
    path(
        "teacher/coupon-detail/<teacher_id>/<coupon_id>/",
        api_views.TeacherCouponDetailAPIView.as_view(),
    ),
    path(
        "teacher/notification-list/<teacher_id>/",
        api_views.TeacherNotificationListAPIView.as_view(),
    ),
    path(
        "teacher/notification-detail/<teacher_id>/<notification_id>/",
        api_views.TeacherNotificationDetailAPIView.as_view(),
    ),
    path("teacher/course-create/", api_views.CourseCreateAPIView.as_view()),
    path(
        "teacher/course-update/<teacher_id>/<course_id>/",
        api_views.CourseUpdateAPIView.as_view(),
    ),
    path("teacher/course-detail/<course_id>/", api_views.TeacherCourseDetailAPIView.as_view()),
    path(
        "teacher/course/variant-delete/<variant_id>/<teacher_id>/<course_id>/",
        api_views.CourseVariantDeleteAPIView.as_view(),
    ),
    path(
        "teacher/course/variant-item-delete/<variant_id>/<variant_item_id>/<teacher_id>/<course_id>/",
        api_views.CourseVariantItemDeleteAPIVIew.as_view(),
    ),
    path('teacher/course-delete/<course_id>/<teacher_id>/',api_views.TeacherCourseDeleteAPIView.as_view())
]
