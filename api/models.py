from django.contrib.auth.models import AbstractUser
from django.db import models, transaction
from decimal import Decimal

class CustomUser(AbstractUser):  # Certifique-se de que é "CustomUser", não "CustomerUser"
    meal_plan_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.username

class Transaction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def save (self, *args, **kwargs):
        amount = Decimal(self.amount)
        
        if self.user.meal_plan_balance < amount:
            raise ValueError("You do not have enough balance for this transaction")
        
        with transaction.atomic():
            self.user.meal_plan_balance -= amount
            self.user.save()
            super().save(*args,**kwargs)                    

        

    def __str__(self):
        return f"{self.user.username} - ${self.amount} em {self.timestamp}"
        
