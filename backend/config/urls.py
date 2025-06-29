from django.contrib import admin
from django.urls import path, include, re_path
from allauth.account.views import confirm_email
from accounts.views import GoogleLogin, LoginPage, GoogleLoginCallback
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponseRedirect
from django.views.generic import TemplateView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('blog.urls')),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/account-confirm-email/<str:key>/', confirm_email, name='account_confirm_email'),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    path("login/", LoginPage.as_view(), name="login"),
    re_path(r"^api/v1/auth/accounts/", include("allauth.urls")),
    path("api/v1/auth/google/", GoogleLogin.as_view(), name="google_login"),
    path("api/v1/auth/google/callback/", GoogleLoginCallback.as_view(), name="google_login_callback"),



    path(
        'api/auth/password/reset/confirm/<uidb64>/<token>/',
        lambda request, uidb64, token: HttpResponseRedirect(
            f'http://localhost:5173/password-reset-confirm?uid={uidb64}&token={token}'
        ),
        name='password_reset_confirm'
    ),
    path(
    'api/auth/password/reset/confirm/<uidb64>/<token>/',
    lambda request, uidb64, token: HttpResponseRedirect(
        f'http://localhost:5173/password-reset-confirm?uid={uidb64}&token={token}'
    ),
    name='password_reset_confirm'  # ✅ IMPORTANT
   ),
    
    path("ckeditor/", include("ckeditor_uploader.urls")),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
