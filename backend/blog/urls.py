from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogViewset,UserBlogView,ImageUploadView,AllBlogView, UserProfileViewSet,PublicUserProfile

router = DefaultRouter()
router.register(r'blogs', BlogViewset, basename='blog')
router.register(r'profile', UserProfileViewSet, basename='profile')  # ✅ add this
urlpatterns = [
    path('', include(router.urls)),
    path('userblogs/',UserBlogView.as_view()),
    path('allblogs/',AllBlogView.as_view()),
    path('public-profile/<int:user__id>/', PublicUserProfile.as_view()),
    path('upload/',ImageUploadView.as_view()),

]

