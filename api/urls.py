from django.urls import path
from .views import UserListView, UserDetailView, TransactionListCreateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),

    path('register/', RegisterView.as_view(), name= 'user_detail'),

    path('transactions/' , TransactionListCreateView.as_view(), name='transaction_list'),

    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
