from rest_framework import generics, viewsets, status
from .models import CustomUser, Transaction, MealPlanOption
from .serializers import (
    UserSerializer, 
    TransactionSerializer, 
    RegisterSerializer, 
    MealPlanOptionSerializer,
    EmailTokenObtainPairSerializer,
    UserTransactionSerializer,
    UserMealPlanSerializer,
    ProfileUpdateSerializer
    # Note: If you use UserMealPlanSerializer in your select_plan action, make sure to import it:
    # UserMealPlanSerializer
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode

#----------------
# Transaction History
from rest_framework import generics, permissions
from .models import Transaction
from .serializers import UserTransactionSerializer

class UserTransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = UserTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

import re

User = get_user_model()
# ------------------------------------------------------------------------------
# UserListView
# ------------------------------------------------------------------------------
class UserListView(generics.ListAPIView):
    """
    API view to list all users.
    
    Only accessible by authenticated users.
    Uses the UserSerializer to serialize CustomUser data.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

# ------------------------------------------------------------------------------
# UserDetailView
# ------------------------------------------------------------------------------
class UserDetailView(generics.RetrieveUpdateAPIView):
    """
    API view to retrieve or update a single user's details.
    
    Accessible by authenticated users. Users can update their own data.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

# ------------------------------------------------------------------------------
# TransactionListCreateView
# ------------------------------------------------------------------------------
class TransactionListCreateView(generics.ListCreateAPIView):
    """
    API view to list all transactions or create a new transaction.
    
    When creating a transaction, the perform_create method:
      - Retrieves the current user.
    """
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
# ------------------------------------------------------------------------------
# RegisterView
# ------------------------------------------------------------------------------
class RegisterView(generics.CreateAPIView):
    """
    API view to register a new user.
    
    Uses RegisterSerializer to handle registration.
    In perform_create, after the serializer creates the user, if no meal plan
    option was provided, it assigns a default plan ("Basic Plan") and sets the user's
    meal swipe balance and flex dollars accordingly.
    """
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # The serializer's create() method already creates the user and assigns a meal plan if provided.
        user = serializer.save()
        # If no meal plan option was set, assign a default plan.
        if not user.meal_plan_option:
            try:
                default_plan = MealPlanOption.objects.get(name="Basic Plan")
            except MealPlanOption.DoesNotExist:
                raise ValidationError("Default plan not found.")
            user.meal_plan_option = default_plan
            user.meal_swipe_balance = default_plan.meal_swipes
            user.flex_dollars = default_plan.flex_dollars
            user.save()

# ------------------------------------------------------------------------------
# MealPlanViewSet
# ------------------------------------------------------------------------------
class MealPlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for listing, retrieving, creating, updating, and deleting MealPlanOption instances.
    
    Accessible by authenticated users.
    
    Includes a custom action 'select_plan' that allows an authenticated user to select
    a meal plan. When this endpoint is hit with a POST request, it updates the user's
    meal_plan_option, meal_swipe_balance, and flex_dollars to match the selected plan.
    """
    queryset = MealPlanOption.objects.all()
    serializer_class = MealPlanOptionSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'])
    def select_plan(self, request, pk=None):
        try:
            # Retrieve the meal plan option object based on the URL's pk
            plan = self.get_object()
            user = request.user
            
            # Update the user's meal plan information to the selected plan
            user.meal_plan_option = plan
            user.meal_swipe_balance = plan.meal_swipes
            user.flex_dollars = plan.flex_dollars
            user.save()
            

            serializer = UserMealPlanSerializer(user)  
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

# ------------------------------------------------------------------------------
# MyAccountView
# ------------------------------------------------------------------------------
class MyAccountView(generics.RetrieveUpdateAPIView):
    """
    API view for authenticated users to retrieve and update their own account details.
    
    The get_object method ensures that only the currently authenticated user's data is returned.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the currently authenticated user
        return self.request.user



class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        print("LoginView POST chamado!")  # Debug inicial
        email = request.data.get('email', '').strip().lower()  # ou remova o .lower() temporariamente
        password = request.data.get('password')
        
        print(f"Email recebido: '{email}'")
        print(f"Senha recebida: '{password}'")
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            print("Usuário não encontrado!")
            return Response({'detail': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.check_password(password):
            print("Senha incorreta!")
            return Response({'detail': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_200_OK)

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

class ForgotPasswordView(APIView):
    """
    API View for handling password reset requests.
    Only allows emails ending with '@usao.edu' (school email).
    """
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        print(f"Received email for reset: {email}")  # Log the received email

        # Validate that an email was provided
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check that the email ends with the allowed domain
        allowed_domain = "@usao.edu"
        if not email.lower().endswith(allowed_domain):
            return Response({'error': f'Email must be a school email ending in {allowed_domain}.'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Try to get the user with the provided email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # For security, we return the same message even if the email doesn't exist
            return Response({'message': 'If the email exists, a reset link has been sent.'}, status=status.HTTP_200_OK)
        
        # Generate a token and a URL-safe encoded user ID
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Build the password reset link pointing to your frontend reset page
        reset_url = f"{settings.FRONTEND_URL}/reset-password/?uid={uidb64}&token={token}"
        
        # Prepare the email content
        subject = "Reset Your Password"
        message = f"Click the link below to reset your password:\n\n{reset_url}\n\nIf you did not request a password reset, please ignore this email."
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]
        
        print(f"Sending reset email to: {recipient_list}")  # Log the recipient list
        
        # Send the email
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        
        return Response({'message': 'If the email exists, a reset link has been sent.'}, status=status.HTTP_200_OK)
    
class ResetPasswordView(APIView):
    """
        API view for resetting a user's password.
        Expects a POST request with uid (encoded), token, and new password.
    """
    def post(self, request, *args, **kwargs):
        uidb64 = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("password")

        if not uidb64 or not token or not new_password:
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not self.is_valid_password(new_password):
            return Response(
                {"error": "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid user."}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        
    def is_valid_password(self, password):
        """
        Checks if the password meets the security criteria.
        - At least 8 characters
        - Contains an uppercase letter
        - Contains a lowercase letter
        - Contains a number
        - Contains a special character
        """
        if len(password) < 8:
            return False
        if not re.search(r'[A-Z]', password):  # Uppercase letter
            return False
        if not re.search(r'[a-z]', password):  # Lowercase letter
            return False
        if not re.search(r'[0-9]', password):  # Number
            return False
        if not re.search(r'[\W_]', password):  # Special character
            return False
        return True
    

class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user