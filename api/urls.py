from django.urls import path, include
from .views import UserListView, UserDetailView, TransactionListCreateView, MealPlanViewSet, RegisterView, MyAccountView, LoginView, ForgotPasswordView, ResetPasswordView, ProfileUpdateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import EmailTokenObtainPairView

#For Transaction History
from django.urls import path
from .views import UserTransactionListCreateView 

router = DefaultRouter()
router.register(r'meal-plans', MealPlanViewSet)

urlpatterns = [
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),
    path('transactions/', TransactionListCreateView.as_view(), name='transaction_list_create'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('my-account/', MyAccountView.as_view(), name='my_account'),
    path('login/', LoginView.as_view(), name='api-login'),

    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('', include(router.urls)),
    
    #Transaction History
    path('user-transactions/', UserTransactionListCreateView.as_view(), name='user-transactions'),

    #profile
    path('profile/', ProfileUpdateView.as_view(), name='profile-update'),

]
