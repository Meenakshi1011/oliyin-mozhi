from django.contrib import admin
from .models import User,Blog
# Register your models here.
admin.site.register(Blog)
admin.site.register(User)