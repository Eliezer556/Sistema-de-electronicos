import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.stores.models import Store
from apps.inventory.models import Component, Category

def run_seed():
    try:
        store = Store.objects.get(name="Electricos Carton")
    except Store.DoesNotExist:
        print("Error: La tienda 'Electricos Carton' no existe en la base de datos.")
        return

    componentes = [
        {
            "name": "Interruptor Automático Termomagnético 20A",
            "category": "Protecciones Eléctricas",
            "mpn": "EB-TM-20",
            "description": "Dispositivo de seguridad para la protección de circuitos contra sobrecargas.",
            "price": 4.50,
            "stock": 45,
            "datasheet_url": "https://unefa-electro.ve/docs/eb-tm-20.pdf",
            "tech_specs": {"Polos": "1", "Voltaje": "120/240V", "Curva": "C"}
        },
        {
            "name": "Rollo de Cable 100m THW #12 Blanco",
            "category": "Conductores y Cables",
            "mpn": "CAB-THW-12W",
            "description": "Conductor de cobre suave con aislamiento termoplástico de PVC.",
            "price": 38.00,
            "stock": 12,
            "datasheet_url": "https://unefa-electro.ve/docs/thw-12.pdf",
            "tech_specs": {"Calibre": "#12 AWG", "Material": "Cobre"}
        },
        {
            "name": "Lámpara Panel LED 18W Luz Fría",
            "category": "Iluminación Industrial",
            "mpn": "LED-PAN-18W",
            "description": "Panel ultra delgado para empotrar en drywall o techos falsos.",
            "price": 3.25,
            "stock": 60,
            "datasheet_url": "https://unefa-electro.ve/docs/panel-18w.pdf",
            "tech_specs": {"Watts": "18W", "Temperatura": "6500K"}
        },
        {
            "name": "Contactor de Potencia 32A Bobina 220V",
            "category": "Control y Automatización",
            "mpn": "LC1-D32",
            "description": "Contactor para el arranque de motores eléctricos trifásicos.",
            "price": 22.50,
            "stock": 8,
            "datasheet_url": "https://unefa-electro.ve/docs/lc1d32.pdf",
            "tech_specs": {"Corriente": "32A", "Bobina": "220V AC"}
        },
        {
            "name": "Toma de Corriente Doble 15A con Tierra",
            "category": "Accesorios de Conexión",
            "mpn": "TOMA-DUP-POL",
            "description": "Tomacorriente estándar NEMA 5-15R resistente a impactos.",
            "price": 1.15,
            "stock": 150,
            "datasheet_url": "https://unefa-electro.ve/docs/toma-estandar.pdf",
            "tech_specs": {"Amp": "15A", "Color": "Blanco"}
        }
    ]

    for data in componentes:
        cat_obj, _ = Category.objects.get_or_create(name=data['category'])
        
        Component.objects.update_or_create(
            mpn=data['mpn'],
            defaults={
                "store": store,
                "category": cat_obj,
                "name": data['name'],
                "description": data['description'],
                "price": data['price'],
                "stock": data['stock'],
                "datasheet_url": data['datasheet_url'],
                "technical_specs": data['tech_specs'],
                "is_available": True
            }
        )
        print(f"Vinculado a {store.name}: {data['name']}")

if __name__ == '__main__':
    run_seed()