from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from apps.stores.models import Store
from apps.inventory.models import Component

class PlatformStatsView(APIView):
    permission_classes = [IsAdminUser] # Solo para administradores de la UNEFA

    def get(self, request):
        # Genera el reporte 
        return Response({
            "total_stores": Store.objects.count(),
            "total_components": Component.objects.count(),
            "low_stock_alerts": Component.objects.filter(stock__lte=5).count(),
            "recent_registrations": Store.objects.order_by('-created_at')[:5].values('name', 'created_at')
        })