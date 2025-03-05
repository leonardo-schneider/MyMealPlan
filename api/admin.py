from django.contrib import admin
from .models import CustomUser, MealPlanOption


admin.site.register(CustomUser)

@admin.register(MealPlanOption)
class MealPlanOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'meal_swipes', 'flex_dollars')

