from rest_framework import generics, viewsets, status
from .models import CustomUser, Transaction, MealPlanOption
from .serializers import (
    UserSerializer, 
    TransactionSerializer, 
    RegisterSerializer, 
    MealPlanOptionSerializer
    # Note: If you use UserMealPlanSerializer in your select_plan action, make sure to import it:
    # UserMealPlanSerializer
)
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from decimal import Decimal
from django.db import transaction 
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from rest_framework.decorators import action

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
    permission_classes = [IsAuthenticatedOrReadOnly]
    
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
            
            # If you want to return detailed user info, use a serializer like UserMealPlanSerializer.
            # Make sure it's imported: from .serializers import UserMealPlanSerializer
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
