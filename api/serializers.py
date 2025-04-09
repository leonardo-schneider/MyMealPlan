from rest_framework import serializers
from .models import CustomUser, Transaction, MealPlanOption
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model
import re

CustomUser = get_user_model()

# ----------------------------------------------------------------------
# UserSerializer
# ----------------------------------------------------------------------
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.
    Used for retrieving user details.

    Fields:
    - id: The user's unique identifier.
    - username: The username.
    - email: The email address.
    - meal_swipe_balance: Current meal swipe balance.
    - flex_dollars: Current flex dollars balance.
    - total_meal_swipes: Computed field for total swipes.
    """
    total_meal_swipes = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'meal_swipe_balance', 'flex_dollars', 'total_meal_swipes']

    def get_total_meal_swipes(self, obj):
        return obj.total_meal_swipes

# ----------------------------------------------------------------------
# TransactionSerializer
# ----------------------------------------------------------------------
class TransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Transaction model.
    Used to create and display transactions.

    Fields:
    - id: The transaction's unique identifier.
    - user: The user who made the transaction (read-only).
    - amount: Number of meal swipes used.
    - cash: Amount of flex dollars used.
    - timestamp: Date and time of the transaction.
    """
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'amount', 'cash', 'timestamp']
        extra_kwargs = {
            'user': {'read_only': True},
        }

# ----------------------------------------------------------------------
# RegisterSerializer
# ----------------------------------------------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for registering a new user.
    Adds 'meal_plan_option_id' for selecting a meal plan.

    Fields:
    - id, username, first_name, last_name, email, password: Standard user fields.
    - meal_plan_option_id: ID of the selected MealPlanOption.
    """
    password = serializers.CharField(write_only=True)
    meal_plan_option_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'meal_plan_option_id']
        extra_kwargs = {
            'username': {'required': False, 'allow_blank': True},
            'password': {'write_only': True},
        }

    def validate_password(self, value):
        """
        Validate password strength.
        """
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        if not re.search(r'[\W_]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def validate_email(self, value):
        """
        Validate that the email address ends with '@usao.edu'.
        """
        allowed_domain = "@usao.edu"
        if not value.lower().endswith(allowed_domain):
            raise serializers.ValidationError(f"Email must be a USAO email (ending in {allowed_domain}).")
        return value

    def create(self, validated_data):
        """
        Create a new user and assign a meal plan option.
        """
        # Extract the meal plan option ID
        option_id = validated_data.pop('meal_plan_option_id')

        # If username is not provided, generate it from the email
        if not validated_data.get('username'):
            email = validated_data.get('email')
            validated_data['username'] = email.split('@')[0]

        # Create user using create_user (this handles password hashing)
        user = CustomUser.objects.create_user(**validated_data)

        # Retrieve the MealPlanOption using the provided ID
        try:
            option = MealPlanOption.objects.get(pk=option_id)
        except MealPlanOption.DoesNotExist:
            raise serializers.ValidationError({'meal_plan_option_id': 'Invalid Meal Plan Option.'})

        # Assign the meal plan option and balances
        user.meal_plan_option = option
        user.meal_swipe_balance = option.meal_swipes
        user.flex_dollars = option.flex_dollars
        user.save()

        return user

# ----------------------------------------------------------------------
# MealPlanOptionSerializer
# ----------------------------------------------------------------------
class MealPlanOptionSerializer(serializers.ModelSerializer):
    """
    Serializer for the MealPlanOption model.
    Used for listing and retrieving meal plan options.

    Fields:
    - id: Unique identifier.
    - name: Name of the meal plan.
    - meal_swipes: Number of meal swipes.
    - flex_dollars: Amount of flex dollars.
    """
    class Meta:
        model = MealPlanOption
        fields = ['id', 'name', 'meal_swipes', 'flex_dollars']

# ----------------------------------------------------------------------
# UserMealPlanSerializer
# ----------------------------------------------------------------------
class UserMealPlanSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model including detailed meal plan info.

    Fields:
    - id, username: User basic info.
    - meal_swipe_balance, flex_dollars: Current balances.
    - meal_plan_option: Nested MealPlanOptionSerializer with meal plan details.
    """
    meal_plan_option = MealPlanOptionSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'meal_swipe_balance', 'flex_dollars', 'meal_plan_option']

# ----------------------------------------------------------------------
# EmailTokenObtainPairSerializer
# ----------------------------------------------------------------------
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom Token serializer to use email instead of username for login.
    """
    username_field = 'email'

    def validate(self, attrs):
        # Capture email and password from request
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Authenticate using email (username field)
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            if user is None:
                raise serializers.ValidationError('Invalid credentials.')
        else:
            raise serializers.ValidationError('Both email and password are required.')

        # If authentication is successful, continue with token generation
        data = super().validate(attrs)
        return data


# Transaction History Serializer
class UserTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'type', 'amount', 'location', 'timestamp']
        extra_kwargs = {
            'user': {'read_only': True},
        }

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'meal_plan_option', 'profile_picture']

    def update(self, instance, validated_data):
        # Update fields one by one
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.meal_plan_option = validated_data.get('meal_plan_option', instance.meal_plan_option)
        
        # Only update the profile picture if provided
        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data['profile_picture']
        
        instance.save()
        return instance