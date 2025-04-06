# api/jobs.py

from django.utils import timezone
from api.models import CustomUser

def reset_meal_swipes():
    
    #Resets the meal swipes for all users to 0.
    users = CustomUser.objects.filter(meal_plan_option__isnull = False)
    for user in users:
        if user.meal_plan_option:
            user.meal_swipe_balance = user.meal_plan_option.meal_swipes
            user.save()
    print("Meal swipes reset at", timezone.now())
