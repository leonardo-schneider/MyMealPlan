from rest_framework import serializers
from .models import CustomUser, Transaction
from django.contrib.auth.models import User
from .models import CustomUser, MealPlanOption, Transaction



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'meal_swipe_balance', 'flex_dollars']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'amount', 'cash', 'timestamp']
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)
    meal_plan_option_id = serializers.IntegerField(write_only = True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'meal_plan_option_id']

    def create(self, validated_data):
        option_id = validated_data.pop('meal_plan_option_id')
        user = CustomUser.objects.create_user(**validated_data)
        try:
            option = MealPlanOption.objects.get(pk= option_id)
        except MealPlanOption.DoesNotExist:
            raise serializers.ValidationError({'meal_plan_option_id': 'Opção de Meal Plan inválida.'})
        
        user.meal_plan_option = option
        user.meal_swipe_balance = option.meal_swipes
        user.flex_dollars = option.flex_dollars
        user.save()
        return user
    

class MealPlanOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlanOption
        fields = ['id', 'name', 'meal_swipes', 'flex_dollars']

class UserMealPlanSerializer(serializers.ModelSerializer):
    meal_plan_option = MealPlanOptionSerializer(read_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'meal_swipe_balance', 'flex_dollars', 'meal_plan_option']
    