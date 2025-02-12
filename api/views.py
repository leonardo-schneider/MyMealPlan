from rest_framework import generics  
from .models import CustomUser, Transaction
from .serializers import UserSerializer, TransactionSerializer, registerSerializer
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
from django.db import transaction 
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):   
        user = self.request.user
        amount = Decimal(serializer.validated_data['amount'])

        if user.meal_plan_balance < amount:
            raise ValueError("Insufficient balance")

        with transaction.atomic():
            user.meal_plan_balance -= amount
            user.save()
            serializer.save(user=user)
                    
class RegisterView(generics.CreateAPIView):
    serializer_class = registerSerializer
    permission_classes = [AllowAny]