# views.py

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import requests
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from rest_framework.permissions import AllowAny

User = get_user_model()

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.GOOGLE_OAUTH_CALLBACK_URL
    client_class = OAuth2Client


class GoogleLoginCallback(APIView):
    permission_classes = [AllowAny] 
    def get(self, request):
        code = request.GET.get("code")
        if not code:
            return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Exchange code for access token
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_OAUTH_CALLBACK_URL,
            "grant_type": "authorization_code",
        }
        token_headers = {"Content-Type": "application/x-www-form-urlencoded"}
        token_response = requests.post(token_url, data=token_data, headers=token_headers)

        try:
            token_json = token_response.json()
        except ValueError:
            return Response({"error": "Invalid token response", "raw": token_response.text}, status=400)

        if "access_token" not in token_json:
            return Response({"error": "No access_token received", "details": token_json}, status=400)

        access_token = token_json["access_token"]

        # 2. Get user info from Google
        user_info_response = requests.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            params={"access_token": access_token}
        )
        try:
            user_info = user_info_response.json()
        except ValueError:
            return Response({"error": "Invalid user info", "raw": user_info_response.text}, status=400)

        email = user_info.get("email")
        name = user_info.get("name")

        # 3. Create or get the user
        user, created = User.objects.get_or_create(email=email)
        if created:
            user.username = email.split("@")[0]
            user.name = name  # if your User model has 'name'
            user.set_unusable_password()
            user.is_active = True 
            user.save()

        # Optional: Generate Token (if using DRF token auth)
        from rest_framework.authtoken.models import Token
        token, _ = Token.objects.get_or_create(user=user)

        # 4. Redirect to frontend with token
        frontend_url = settings.FRONTEND_REDIRECT_URL
        return redirect(f"{frontend_url}?token={token.key}")

from django.conf import settings
from django.shortcuts import render
from django.views import View


class LoginPage(View):
    def get(self, request, *args, **kwargs):
        return render(
            request,
            "account/login.html",
            {
                "google_callback_uri": settings.GOOGLE_OAUTH_CALLBACK_URL,
                "google_client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
            },
        )