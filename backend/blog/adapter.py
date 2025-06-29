from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        return True

    def confirm_email(self, request, email_address):
        super().confirm_email(request, email_address)  # crucial to avoid recursion
        user = email_address.user
        user.is_active = True
        user.save()
