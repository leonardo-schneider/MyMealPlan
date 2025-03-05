from django.contrib.auth.models import AbstractUser
from django.db import models, transaction
from decimal import Decimal

class CustomUser(AbstractUser):  # Certifique-se de que é "CustomUser", não "CustomerUser"
    meal_swipe_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    flex_dollars = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    meal_plan_option = models.ForeignKey('MealPlanOption', null=True, blank=True, on_delete=models.SET_NULL)
    
    def save(self, *args, **kwargs):
            # Se o usuário tiver uma opção de meal plan definida,
            # atualize os saldos conforme os valores dessa opção.
            if self.meal_plan_option:
                self.meal_swipe_balance = self.meal_plan_option.meal_swipes
                self.flex_dollars = self.meal_plan_option.flex_dollars
            super().save(*args, **kwargs)
            
    def __str__(self):
        return self.username

class Transaction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    cash = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def save (self, *args, **kwargs):
        amount = Decimal(self.amount)
        cash = Decimal(self.cash)
        
        if self.user.flex_dollars < cash:
            raise ValueError("Insufficient balance")
        
        if self.user.meal_swipe_balance < amount:
            raise ValueError("You do not have enough balance for this transaction")
        
        with transaction.atomic():
            self.user.flex_dollars -= cash
            self.user.meal_swipe_balance -= amount
            self.user.save()
            super().save(*args,**kwargs)                    

        

    def __str__(self):
        return f"{self.user.username} - Swipes {self.amount} e $ {self.cash} em {self.timestamp}"
        

class MealPlanOption(models.Model):
    name = models.CharField(max_length = 50)
    meal_swipes = models.PositiveIntegerField()
    flex_dollars = models.DecimalField(max_digits =10, decimal_places=2)

    class Meta:
        ordering = ['meal_swipes']

    def __str__(self):
        return f"{self.meal_swipes} swipes + ${self.flex_dollars} flex"
    