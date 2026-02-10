from rest_framework import viewsets, permissions, exceptions
from rest_framework.response import Response
from .models import Store
from .serializers import StoreSerializer
from geopy.distance import geodesic

# 1. CLASE DE PERMISO PERSONALIZADA
class IsStoreOwner(permissions.BasePermission):
    """
    Permiso que permite a los proveedores editar solo SU tienda.
    Los administradores tienen acceso total.
    """
    def has_object_permission(self, request, view, obj):
        # El administrador siempre tiene permiso
        if request.user.is_staff or getattr(request.user, 'role', None) == 'admin':
            return True
        
        # El usuario debe ser el dueño Y tener el rol de proveedor
        is_owner = (obj.owner == request.user)
        is_provider = (getattr(request.user, 'role', None) == 'proveedor')
        
        return is_owner and is_provider

# 2. VISTA COMPLETA
class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

    def get_queryset(self):
        """
        Personalizamos el QuerySet para:
        1. Filtrar por cercanía (geolocalización).
        2. Filtrar por dueño cuando se usa el parámetro ?manage=true.
        """
        queryset = Store.objects.all()
        user_lat = self.request.query_params.get('lat')
        user_lon = self.request.query_params.get('lon')

        if user_lat and user_lon:
            try:
                user_location = (float(user_lat), float(user_lon))
                valid_store_ids = []
                for store in queryset:
                    if store.latitude and store.longitude:
                        store_location = (store.latitude, store.longitude)
                        distance = geodesic(user_location, store_location).km
                        if distance <= 5.0:  # Radio de 5km
                            valid_store_ids.append(store.id)
                queryset = queryset.filter(id__in=valid_store_ids)
            except ValueError:
                pass 

        if self.action == 'list' and self.request.query_params.get('manage'):
            if self.request.user.is_authenticated and not self.request.user.is_staff:
                return queryset.filter(owner=self.request.user)
        
        return queryset

    def get_permissions(self):
        """
        Configuración de permisos según la acción:
        - Listar y ver detalle: Público.
        - Actualizar y borrar: Solo el dueño (Proveedor).
        - Crear: Cualquier usuario autenticado (se valida el rol en perform_create).
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsStoreOwner]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """
        Asigna automáticamente al usuario actual como dueño al crear la tienda.
        Solo permite la creación si el usuario es proveedor.
        """
        if getattr(self.request.user, 'role', None) != 'proveedor' and not self.request.user.is_staff:
            raise exceptions.PermissionDenied("Solo los usuarios con rol 'proveedor' pueden crear tiendas.")
        
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        """
        El permiso IsStoreOwner ya validó la propiedad, aquí solo guardamos.
        """
        serializer.save()
        
    def retrieve(self, request, *args, **kwargs):
        """
        Este método responde a GET /api/stores/<id>/
        Es el que llama tu refreshStoreData()
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)