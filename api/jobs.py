# api/jobs.py

from django.utils import timezone
from api.models import CustomUser

def reset_meal_swipes():
    """
    Percorre todos os usuários e, se tiverem uma opção de meal plan,
    reseta o saldo de meal swipes para o valor definido nessa opção.
    """
    users = CustomUser.objects.all()
    for user in users:
        if user.meal_plan_option:
            user.meal_plan_balance = user.meal_plan_option.meal_swipes
            user.save()
    print("Meal swipes reset at", timezone.now())
