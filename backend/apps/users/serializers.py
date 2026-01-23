from rest_framework import serializers
from django.db import transaction
from apps.stores.models import Store
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Este correo ya está registrado.")]
    )
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'password']
        extra_kwargs = {
            'password': {'write_only': True} # La contraseña no se envía en el JSON de respuesta
        }
        
    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    store_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    store_address = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'first_name', 'last_name', 'role', 'store_name', 'store_address']

    def validate(self, attrs):
        if attrs.get('role') == 'proveedor':
            if not attrs.get('store_name') or attrs.get('store_name').strip() == "":
                raise serializers.ValidationError({"store_name": "Nombre de tienda requerido."})
            if not attrs.get('store_address') or attrs.get('store_address').strip() == "":
                raise serializers.ValidationError({"store_address": "Dirección requerida."})
        return attrs

    def create(self, validated_data):
        store_name = validated_data.pop('store_name', None)
        store_address = validated_data.pop('store_address', None)
        
        with transaction.atomic():
            user = User.objects.create_user(**validated_data)
            if user.role == 'proveedor' and store_name and store_address:
                Store.objects.create(
                    owner=user,
                    name=store_name,
                    address=store_address
                )
            return user    
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'role': self.user.role,
        }
        
        data['role'] = self.user.role
        
        return data