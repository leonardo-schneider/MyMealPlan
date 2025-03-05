from rest_framework import generics, viewsets, status
from .models import CustomUser, Transaction, MealPlanOption
from .serializers import UserSerializer, TransactionSerializer, RegisterSerializer, MealPlanOptionSerializer
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
from django.db import transaction 
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.exceptions import ValidationError
from rest_framework.decorators import action

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
        cash = Decimal(serializer.validated_data['cash'])

        if user.meal_swipe_balance < amount or user.flex_dollars < cash:
            raise ValidationError("Insufficient balance")

        with transaction.atomic():
            user.flex_dollars -= cash
            user.meal_swipe_balance -= amount
            user.save()
            serializer.save(user=user)
                    
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
    # O serializer.create() já cria o usuário e atribui o plano conforme meal_plan_option_id enviado.
        user = serializer.save()
        # Se, por algum motivo, o usuário não enviou nenhuma opção (ou se meal_plan_option for None), então:
        if not user.meal_plan_option:
            try:
                default_plan = MealPlanOption.objects.get(name="Basic Plan")
            except MealPlanOption.DoesNotExist:
                raise ValidationError("Plano padrão não encontrado.")
            user.meal_plan_option = default_plan
            user.meal_swipe_balance = default_plan.meal_swipes
            user.flex_dollars = default_plan.flex_dollars
            user.save()

class MealPlanViewSet(viewsets.ModelViewSet):
    queryset = MealPlanOption.objects.all()
    serializer_class = MealPlanOptionSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def select_plan(self, request, pk=None):
        try:
            plan = self.get_object()
            user = request.user
            
            # Atualiza o plano do usuário
            user.meal_plan_option = plan
            user.meal_swipe_balance = plan.meal_swipes
            user.flex_dollars = plan.flex_dollars
            user.save()
            
            serializer = UserMealPlanSerializer(user)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class MyAccountView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Retorna o usuário autenticado
        return self.request.user
