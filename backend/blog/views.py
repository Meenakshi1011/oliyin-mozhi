# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.exceptions import AuthenticationFailed
# from .serializers import UserSerializer
# from .models import User
# import jwt
# import datetime

# # RegisterView: Handles user signup
# class RegisterView(APIView):
#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)

# # LoginView: Handles login and JWT generation
# class LoginView(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')

#         user = User.objects.filter(email=email).first()

#         if user is None:
#             raise AuthenticationFailed('User not found!')

#         if not user.check_password(password):
#             raise AuthenticationFailed('Incorrect password!')

#         payload = {
#             'id': user.id,
#             'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
#             'iat': datetime.datetime.utcnow()
#         }

#         token = jwt.encode(payload, 'secret', algorithm='HS256')

#         response = Response()
#         response.set_cookie(key='jwt', value=token, httponly=True)
#         response.data = {
#             'jwt': token
#         }
#         return response

# # UserView: Returns authenticated user details using JWT
# class UserView(APIView):
#     def get(self, request):
#         token = request.COOKIES.get('jwt')

#         if not token:
#             raise AuthenticationFailed('Unauthenticated!')

#         try:
#             payload = jwt.decode(token, 'secret', algorithms=['HS256'])
#         except jwt.ExpiredSignatureError:
#             raise AuthenticationFailed('Unauthenticated!')

#         user = User.objects.filter(id=payload['id']).first()
#         serializer = UserSerializer(user)
#         return Response(serializer.data)

# # LogoutView: Logs out user by deleting JWT cookie
# class LogoutView(APIView):
#     def post(self, request):
#         response = Response()
#         response.delete_cookie('jwt')
#         response.data = {
#             'message': 'Logged out successfully'
#         }
#         return response
from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.generics import ListAPIView
from django.core.files.storage import default_storage
from django.conf import settings
from .models import Blog
from .models import UserProfile

from .serializers import BlogSerializer, UserSerializer,UserProfileSerializer,PublicUserProfileSerializer

class BlogViewset(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class UserBlogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class ImageUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        image = request.FILES['image']
        path = default_storage.save(f'uploads/{image.name}', image)
        return Response({'url': f'{settings.MEDIA_URL}{path}'})

class AllBlogView(ListAPIView):
    queryset = Blog.objects.select_related('author').all()
    serializer_class = BlogSerializer
    permission_classes = [permissions.AllowAny]


from rest_framework.decorators import action
from rest_framework.response import Response

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get", "patch"])
    def me(self, request):
        profile = self.get_queryset().first()
        
        if request.method == "PATCH":
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # GET request
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

from rest_framework.generics import RetrieveAPIView

class PublicUserProfile(RetrieveAPIView):
    serializer_class = PublicUserProfileSerializer
    permission_classes = [permissions.AllowAny]
    queryset = UserProfile.objects.all()
    lookup_field = 'user__id'  # expects the URL to use /<user_id>/
