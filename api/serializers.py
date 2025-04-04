from rest_framework import serializers
from .models import CustomUser, Transaction, MealPlanOption
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model

CustomUser = get_user_model()
# ------------------------------------------------------------------------------
# UserSerializer
# ------------------------------------------------------------------------------
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.
    This serializer is used for retrieving user details.
    
    Fields:
    - id: The user's unique identifier.
    - username: The username.
    - email: The email address.
    - meal_swipe_balance: The current balance of meal swipes for the user.
    - flex_dollars: The current balance of flex dollars (cash) for the user.
    """
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name','email', 'meal_swipe_balance', 'flex_dollars']


# ------------------------------------------------------------------------------
# TransactionSerializer
# ------------------------------------------------------------------------------
class TransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Transaction model.
    Used to create and display transactions.
    
    Fields:
    - id: The unique identifier of the transaction.
    - user: The user who made the transaction.
    - amount: The number of meal swipes used in the transaction.
    - cash: The amount of flex dollars used.
    - timestamp: The date and time when the transaction occurred.
    - By setting the "user" field as read-only, you're telling the serializer not to require it in the input data.
    """
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'amount', 'cash', 'timestamp']
        extra_kwargs = {
            'user': {'read_only': True},
        }

# ------------------------------------------------------------------------------
# RegisterSerializer
# ------------------------------------------------------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for registering a new user.
    It includes an additional field 'meal_plan_option_id' for the user to choose
    a meal plan option during registration, and 'password' is write-only.
    
    Fields:
    - id, username, first_name, last_name, email, password: Standard user registration fields.
    - meal_plan_option_id: An extra field representing the primary key of the 
      selected MealPlanOption.
    
    The create() method is overridden to:
      1. Remove the meal_plan_option_id from the validated data.
      2. Create the user using create_user() (which handles password hashing).
      3. Retrieve the MealPlanOption based on the provided ID.
      4. Set the user's meal_plan_option, meal_swipe_balance, and flex_dollars
         according to the selected plan.
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
    
    def validate_email(self, value):
        """
        Validate that the email address ends with '@usao.edu'.
        """
        allowed_domain = "@usao.edu"
        if not value.lower().endswith(allowed_domain):
            raise serializers.ValidationError(f"Email must be a USAO email (ending in {allowed_domain}).")
        return value

    def create(self, validated_data):
        # Extract the meal_plan_option_id from the validated data.
        option_id = validated_data.pop('meal_plan_option_id')
        
        # If username is not provided, generate it from the email (the part before '@').
        if not validated_data.get('username'):
            email = validated_data.get('email')
            validated_data['username'] = email.split('@')[0]
        
        # Create the user using the create_user() method (handles password hashing).
        user = CustomUser.objects.create_user(**validated_data)
        
        # Try to retrieve the MealPlanOption instance using the provided option_id.
        try:
            option = MealPlanOption.objects.get(pk=option_id)
        except MealPlanOption.DoesNotExist:
            # If the option doesn't exist, raise a validation error.
            raise serializers.ValidationError({'meal_plan_option_id': 'Invalid Meal Plan Option.'})
        
        # Assign the retrieved meal plan option to the user.
        user.meal_plan_option = option
        # Set the user's meal swipe balance and flex dollars based on the option.
        user.meal_swipe_balance = option.meal_swipes
        user.flex_dollars = option.flex_dollars
        # Save the user with the updated information.
        user.save()
        return user


# ------------------------------------------------------------------------------
# MealPlanOptionSerializer
# ------------------------------------------------------------------------------
class MealPlanOptionSerializer(serializers.ModelSerializer):
    """
    Serializer for the MealPlanOption model.
    Used for listing and retrieving meal plan options.
    
    Fields:
    - id: The unique identifier of the meal plan option.
    - name: A descriptive name for the meal plan.
    - meal_swipes: The number of meal swipes provided by this plan.
    - flex_dollars: The amount of flex dollars provided by this plan.
    """
    class Meta:
        model = MealPlanOption
        fields = ['id', 'name', 'meal_swipes', 'flex_dollars']


# ------------------------------------------------------------------------------
# UserMealPlanSerializer
# ------------------------------------------------------------------------------
class UserMealPlanSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model, including detailed information about
    the user's meal plan option.
    
    Fields:
    - id, username: Basic user information.
    - meal_swipe_balance, flex_dollars: The user's current balances.
    - meal_plan_option: A nested serializer (MealPlanOptionSerializer) that 
      provides details of the meal plan option assigned to the user.
    """
    meal_plan_option = MealPlanOptionSerializer(read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'meal_swipe_balance', 'flex_dollars', 'meal_plan_option']


User = get_user_model()

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Sobrescreve o campo padrão para usar email
    username_field = 'email'

    def validate(self, attrs):
        # Capture email e senha do payload
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Aqui, a função authenticate por padrão utiliza o campo 'username'.
            # Se você não tiver um backend customizado que autentique pelo email,
            # pode ser necessário buscar o usuário pelo email e verificar a senha manualmente.
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            if user is None:
                raise serializers.ValidationError('Credenciais inválidas')
        else:
            raise serializers.ValidationError('É necessário fornecer email e senha')

        # Se a autenticação for bem-sucedida, o método da superclasse retornará os tokens
        data = super().validate(attrs)
        return data