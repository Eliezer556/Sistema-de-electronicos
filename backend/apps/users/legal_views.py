from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

class LegalDocumentsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        
        return Response({
            "terms_and_conditions": "Contenido de los Términos y Condiciones para UNEFA...",
            "privacy_policy": "Cómo protegemos los datos de los estudiantes...",
            "disclaimer": "Descargo de responsabilidad sobre el stock de las tiendas..."
        })