from django.contrib import admin
from api import models


class CartAdmin(admin.ModelAdmin):
    list_display = ["id", "cart_id", "course"]


class CourseAdmin(admin.ModelAdmin):
    list_display = ["id", "course_id", "title"]


class CartOrderAdmin(admin.ModelAdmin):
    list_display = ["id", "cart_order_id", "full_name"]


class CartOrderItemAdmin(admin.ModelAdmin):
    list_display = ["id", "cart_order_item_id", "order"]


class ReviewAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "rating"]


class CouponAdmin(admin.ModelAdmin):
    list_display = ["id", "code", "active"]


class NotificationAdmin(admin.ModelAdmin):
    list_display = ["id", "seen", "type"]

class VariantAdmin(admin.ModelAdmin):
    list_display = ['id','course__title','title']

class VariantItemAdmin(admin.ModelAdmin):
    list_display = ['id','variant__course__title','variant__title','title']
    
admin.site.register(models.Teacher)
admin.site.register(models.Category)
admin.site.register(models.Course, CourseAdmin)
admin.site.register(models.Variant,VariantAdmin)
admin.site.register(models.VariantItem,VariantItemAdmin)
admin.site.register(models.Question_Answer)
admin.site.register(models.Question_Answer_Message)
admin.site.register(models.Cart, CartAdmin)
admin.site.register(models.CartOrder, CartOrderAdmin)
admin.site.register(models.CartOrderItem, CartOrderItemAdmin)
admin.site.register(models.Certificate)
admin.site.register(models.CompletedLesson)
admin.site.register(models.EnrolledCourse)
admin.site.register(models.Note)
admin.site.register(models.Review, ReviewAdmin)
admin.site.register(models.Notification,NotificationAdmin)
admin.site.register(models.Coupon, CouponAdmin)
admin.site.register(models.Wishlist)
admin.site.register(models.Country)
