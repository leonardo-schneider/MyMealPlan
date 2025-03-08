from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from api.models import CustomUser, MealPlanOption
from decimal import Decimal

# ------------------------------------------------------------------------------
# UserRegistrationTest
# ------------------------------------------------------------------------------
class UserRegistrationTest(APITestCase):
    """
    Test case for the user registration endpoint.
    
    This test verifies that a new user is registered correctly,
    and that their meal swipe balance and flex dollars are set based
    on the chosen MealPlanOption.
    """
    def setUp(self):
        # Create a MealPlanOption instance to be used during registration.
        self.meal_plan = MealPlanOption.objects.create(
            name="Basic Plan",
            meal_swipes=5,
            flex_dollars="500.00"
        )
        # Reverse the URL for the registration endpoint using its URL name.
        self.register_url = reverse("register")

    def test_register_user(self):
        # Prepare data for registration, including the meal_plan_option_id.
        data = {
            "username": "testeuser",
            "email": "testeuser@example.com",
            "password": "123456",
            "meal_plan_option_id": self.meal_plan.id
        }
        # Send a POST request to register a new user.
        response = self.client.post(self.register_url, data, format="json")
        # Check that the response status code is 201 Created.
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Retrieve the newly created user from the database.
        user = CustomUser.objects.get(username="testeuser")
        # Verify that the user's meal swipe balance equals the meal_swipes value of the meal plan.
        self.assertEqual(user.meal_swipe_balance, self.meal_plan.meal_swipes)
        # Verify that the user's flex dollars match the flex_dollars of the meal plan.
        self.assertEqual(user.flex_dollars, Decimal(self.meal_plan.flex_dollars))


# ------------------------------------------------------------------------------
# LoginTest
# ------------------------------------------------------------------------------
class LoginTest(APITestCase):
    """
    Test case for the login endpoint using JWT.
    
    This test ensures that a registered user can obtain an access and refresh token
    by providing the correct credentials.
    """
    def setUp(self):
        # Create a MealPlanOption instance for the user.
        self.meal_plan = MealPlanOption.objects.create(
            name="Basic Plan",
            meal_swipes=5,
            flex_dollars="500.00"
        )
        # Create a test user.
        self.user = CustomUser.objects.create_user(
            username="testeuser",
            email="testeuser@example.com",
            password="123456"
        )
        # Assign the meal plan option and initial balances to the user.
        self.user.meal_plan_option = self.meal_plan
        self.user.meal_swipe_balance = self.meal_plan.meal_swipes
        self.user.flex_dollars = self.meal_plan.flex_dollars
        self.user.save()
        # Reverse the URL for obtaining JWT tokens.
        self.token_url = reverse("token_obtain_pair")

    def test_login_get_token(self):
        # Prepare login data.
        data = {
            "username": "testeuser",
            "password": "123456"
        }
        # Send a POST request to obtain the token pair.
        response = self.client.post(self.token_url, data, format="json")
        # Check that the response status code is 200 OK.
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Assert that the response data contains 'access' and 'refresh' tokens.
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)


# ------------------------------------------------------------------------------
# MyAccountTest
# ------------------------------------------------------------------------------
class MyAccountTest(APITestCase):
    """
    Test case for the "My Account" endpoint.
    
    This test ensures that an authenticated user can retrieve their own account details,
    including username and the correct meal swipe balance.
    """
    def setUp(self):
        # Create a MealPlanOption instance.
        self.meal_plan = MealPlanOption.objects.create(
            name="Basic Plan",
            meal_swipes=5,
            flex_dollars="500.00"
        )
        # Create a test user.
        self.user = CustomUser.objects.create_user(
            username="testeuser",
            email="testeuser@example.com",
            password="123456"
        )
        # Assign the meal plan option and set the initial balances.
        self.user.meal_plan_option = self.meal_plan
        self.user.meal_swipe_balance = self.meal_plan.meal_swipes
        self.user.flex_dollars = self.meal_plan.flex_dollars
        self.user.save()
        # Reverse the URL for the "My Account" endpoint.
        self.my_account_url = reverse("my_account")

    def test_get_my_account(self):
        # Log in using the test user's credentials.
        self.client.login(username="testeuser", password="123456")
        # Send a GET request to the "My Account" endpoint.
        response = self.client.get(self.my_account_url)
        # Check that the response status code is 200 OK.
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify that the username in the response is correct.
        self.assertEqual(response.data["username"], "testeuser")
        # Format the expected meal swipe balance as a string with two decimal places.
        expected = f"{self.meal_plan.meal_swipes:.2f}"  # e.g., "5.00"
        self.assertEqual(response.data["meal_swipe_balance"], expected)
