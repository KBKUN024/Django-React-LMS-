from django.contrib import admin
from userauths.models import User, Profile


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["id", "username", "full_name", "email"]
    search_fields = ["username", "email"]


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["full_name", "date"]
    search_fields = ["full_name"]
