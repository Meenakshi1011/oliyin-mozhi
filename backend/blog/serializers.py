from rest_framework import serializers
from .models import User, Blog, BlogImage
from dj_rest_auth.registration.serializers import RegisterSerializer
from allauth.account.utils import send_email_confirmation
from dj_rest_auth.serializers import LoginSerializer, UserDetailsSerializer

class CustomUserDetailsSerializer(UserDetailsSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'name')

class CustomLoginSerializer(LoginSerializer):
    username = None
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.EmailField()
        self.fields.pop('username', None)

class CustomRegisterSerializer(RegisterSerializer):
    name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop('username', None)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['name'] = self.validated_data.get('name', '')
        data.pop('username', None)
        return data

    def custom_signup(self, request, user):
        user.name = self.validated_data.get('name', '')
        user.save()
        send_email_confirmation(request, user, signup=True)

class BlogImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogImage
        fields = ['image']

class BlogSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='author.id', read_only=True)
    created_at = serializers.DateField(format="%B %d, %Y", read_only=True)
    name = serializers.CharField(source='author.name', read_only=True)
    images = BlogImageSerializer(many=True, read_only=True)

    class Meta:
        model = Blog
        fields = ['user_id','name', 'id', 'blog_title', 'created_at', 'blog_content', 'images']

class UserSerializer(serializers.ModelSerializer):
    blogs = BlogSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'password', 'blogs']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
    
    
    
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['name', 'email', 'description', 'image']



class PublicUserProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id')
    name = serializers.CharField(source='user.name')
    email = serializers.EmailField(source='user.email')
    blogs = BlogSerializer(source='user.blogs', many=True)

    class Meta:
        model = UserProfile
        fields = ['user_id', 'name', 'email', 'description', 'image', 'blogs']



