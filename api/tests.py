from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from api.models import CustomUser, MealPlanOption
from decimal import Decimal
class UserRegistrationTest(APITestCase):
    def setUp(self):
        # Crie uma opção de meal plan para o teste (se ainda não existir)
        self.meal_plan = MealPlanOption.objects.create(
            name="Basic Plan",
            meal_swipes=5,
            flex_dollars="500.00"
        )
        self.register_url = reverse("register")  # Certifique-se de que o nome da rota está correto

    def test_register_user(self):
        data = {
            "username": "testeuser",
            "email": "testeuser@example.com",
            "password": "123456",
            "meal_plan_option_id": self.meal_plan.id
        }
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verifique se o usuário foi criado com os saldos corretos
        
        user = CustomUser.objects.get(username="testeuser")
        
        self.assertEqual(user.meal_swipe_balance, self.meal_plan.meal_swipes)
        self.assertEqual(user.flex_dollars, Decimal(self.meal_plan.flex_dollars))
# Create your tests here.
from rest_framework_simplejwt.tokens import RefreshToken

class LoginTest(APITestCase):
    def setUp(self):
        self.meal_plan = MealPlanOption.objects.create(
            name="Basic Plan",
            meal_swipes=5,
            flex_dollars="500.00"
        )
        self.user = CustomUser.objects.create_user(
            username="testeuser",
            email="testeuser@example.com",
            password="123456",
        )
        # Atribui o plano padrão se necessário:
        self.user.meal_plan_option = self.meal_plan
        self.user.meal_swipe_balance = self.meal_plan.meal_swipes
        self.user.flex_dollars = self.meal_plan.flex_dollars
        self.user.save()
        self.token_url = reverse("token_obtain_pair")

    def test_login_get_token(self):
        data = {
            "username": "testeuser",
            "password": "123456"
        }
        response = self.client.post(self.token_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)



class MyAccountTest(APITestCase):
    def setUp(self):
        self.meal_plan = MealPlanOption.objects.create(
            name="Basic Plan",
            meal_swipes=5,
            flex_dollars="500.00"
        )
        self.user = CustomUser.objects.create_user(
            username="testeuser",
            email="testeuser@example.com",
            password="123456",
        )
        self.user.meal_plan_option = self.meal_plan
        self.user.meal_swipe_balance = self.meal_plan.meal_swipes
        self.user.flex_dollars = self.meal_plan.flex_dollars
        self.user.save()
        self.my_account_url = reverse("my_account")

    def test_get_my_account(self):
        # Obter token para autenticar
        self.client.login(username="testeuser", password="123456")  # método alternativo de autenticação para testes
        response = self.client.get(self.my_account_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testeuser")
        expected = f"{self.meal_plan.meal_swipes:.2f}"  # Formata 5 como "5.00"
        self.assertEqual(response.data["meal_swipe_balance"], expected)