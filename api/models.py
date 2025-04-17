from django.contrib.auth.models import AbstractUser
from django.db import models, transaction
from decimal import Decimal
from django.conf import settings


class CustomUser(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    
    Additional fields:
    - meal_swipe_balance: Represents the number of meal swipes the user currently has.
    - flex_dollars: Represents the cash balance (flex dollars) the user currently has.
    - meal_plan_option: A foreign key linking the user to a MealPlanOption that defines their default balances.
    
    The save() method is overridden to automatically update the user's meal swipe and flex dollar balances
    based on the associated MealPlanOption whenever the user is saved.
    """
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    meal_swipe_balance = models.IntegerField(default=0)
    flex_dollars = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    buddy_swipe_balance = models.IntegerField(default=0)
    meal_plan_option = models.ForeignKey('MealPlanOption', null=True, blank=True, on_delete=models.SET_NULL)

    def save(self, *args, **kwargs):
            # Only set initial balances when the user is created
            if not self.pk and self.meal_plan_option:
                self.meal_swipe_balance = self.meal_plan_option.meal_swipes
                self.flex_dollars = self.meal_plan_option.flex_dollars
                self.buddy_swipe_balance = self.meal_plan_option.buddy_swipes
            super().save(*args, **kwargs)
    

    @property
    def total_meal_swipes(self):
        """
        Returns the total number of meal swipes provided by the user's selected meal plan.
        If no meal plan is set, returns 0.
        """
        if self.meal_plan_option:
            return self.meal_plan_option.meal_swipes
        return 0
    
    
    def __str__(self):
        # Returns the username as the string representation of the user.
        return self.username


class Transaction(models.Model):
    """
    Model to represent a transaction where a user uses some meal swipes and/or flex dollars.
    
    Fields:
    - user: The user who performed the transaction.
    - cash: The amount of flex dollars used in the transaction.
    - amount: The number of meal swipes used in the transaction.
    - timestamp: The date and time when the transaction occurred (automatically set when created).
    
    The save() method is overridden to:
    - Verify that the user has enough flex dollars and meal swipes.
    - Deduct the used amounts from the user's balances in an atomic transaction.
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    cash = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        # Convert the values to Decimal for accurate arithmetic operations.
        amount = Decimal(self.amount)
        cash = Decimal(self.cash)
        
        # Check if the user has enough flex dollars.
        if self.user.flex_dollars < cash:
            raise ValueError("Insufficient balance")
        
        # Check if the user has enough meal swipes.
        if self.user.meal_swipe_balance < amount:
            raise ValueError("You do not have enough balance for this transaction")
        
        # Use an atomic transaction to ensure that both balance updates and the transaction record are saved together.
        with transaction.atomic():
            self.user.flex_dollars -= cash
            self.user.meal_swipe_balance -= amount
            self.user.save()
            super().save(*args, **kwargs)
                    
    def __str__(self):
        # Returns a string representation showing the user, number of swipes, cash used, and timestamp.
        return f"{self.user.username} - Swipes {self.amount} and $ {self.cash} at {self.timestamp}"


class MealPlanOption(models.Model):
    """
    Model representing a meal plan option that defines a set number of meal swipes and a flex dollars balance.
    
    Fields:
    - name: The name or description of the meal plan option.
    - meal_swipes: The default number of meal swipes provided by this plan.
    - flex_dollars: The default amount of flex dollars provided by this plan.
    
    The Meta class orders the options by the number of meal swipes.
    """
    name = models.CharField(max_length=50)
    meal_swipes = models.PositiveIntegerField()
    flex_dollars = models.DecimalField(max_digits=10, decimal_places=2)
    buddy_swipe_balance = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['meal_swipes']

    def __str__(self):
        # Returns a descriptive string for the meal plan option.
        return f"{self.meal_swipes} swipes + ${self.flex_dollars} flex"


# Transaction History Backend
class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('meal', 'Meal Swipe'),
        ('flex', 'Flex Dollars'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES, default = 'Meal Swipe')
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    location = models.CharField(max_length=100, default='Cafeteria')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.amount} @ {self.location}"
