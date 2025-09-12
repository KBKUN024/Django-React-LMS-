from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save


class User(AbstractUser):
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True)
    full_name = models.CharField(unique=True, max_length=100)
    otp = models.CharField(max_length=100, null=True, blank=True)
    refresh_token = models.CharField(max_length=400, blank=True, null=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        # 确保email存在且是字符串
        if self.email:
            email_username, _ = str(self.email).split("@")
            if not self.full_name:
                self.full_name = email_username
            if not self.username:
                self.username = email_username
        super(User, self).save(
            *args, **kwargs
        )  # 和super().save(*args, **kwargs)效果是一样的，这个是python3的写法，原来的是python2的写法


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(
        upload_to="user_folder", default="default-user.jpg", null=True, blank=True
    )
    full_name = models.CharField(max_length=100)
    country = models.CharField(max_length=100, null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.full_name:
            return str(self.full_name)
        else:
            # 类型检查时可能报错，但运行时正常
            return str(self.user.full_name)  # type: ignore

    def save(self, *args, **kwargs):
        if not self.full_name:
            self.full_name = self.user.username  # type: ignore
        super(Profile, self).save(*args, **kwargs)


# 以下的方法都是为了创建一个user的同时，就创建他对应的profile
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


def save_user_profile(sender, instance, **kwargs):
    # 避免递归调用，只在profile存在时保存
    if hasattr(instance, "profile"):
        # 使用update_fields避免无限递归
        instance.profile.save()


post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)
