import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export function StoreApiMap({ lat, lon, apiKey }) {
    const mapContainer = useRef(null);
    const mapInstance = useRef(null);

    // Función para centrar el mapa (Botón de Retorno)
    const handleResetView = () => {
        if (mapInstance.current) {
            mapInstance.current.flyTo({
                center: [parseFloat(lon), parseFloat(lat)],
                zoom: 17,
                essential: true
            });
        }
    };

    useEffect(() => {
        // 1. Validaciones iniciales
        if (!mapContainer.current || !apiKey || isNaN(lat) || isNaN(lon)) return;

        // 2. Limpieza de instancia previa de forma segura
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }

        try {
            // 3. Inicialización de la nueva instancia
            const map = new maplibregl.Map({
                container: mapContainer.current,
                style: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${apiKey}`,
                center: [parseFloat(lon), parseFloat(lat)],
                zoom: 17,
                attributionControl: false
            });

            mapInstance.current = map;

            // 4. Agregar controles cuando el mapa cargue
            map.on('load', () => {
                map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
                
                new maplibregl.Marker({ color: "#9333ea" })
                    .setLngLat([parseFloat(lon), parseFloat(lat)])
                    .addTo(map);
            });

        } catch (error) {
            console.error("Error inicializando el mapa:", error);
        }

        // 5. Cleanup al desmontar el componente
        return () => {
            if (mapInstance.current) {
                // Verificamos que los handlers existan para evitar el TypeError
                const map = mapInstance.current;
                if (map && typeof map.remove === 'function') {
                    map.remove();
                    mapInstance.current = null;
                }
            }
        };
    }, [lat, lon, apiKey]); // Dependencias correctas

    return (
        <div className="w-full h-full min-h-[250px] relative">
            <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
            
            {/* Botón de Retorno */}
            <button 
                onClick={handleResetView}
                className="absolute bottom-4 left-4 z-10 bg-purple-600 hover:bg-white text-white hover:text-black p-2 rounded-sm shadow-xl transition-all duration-300 flex items-center gap-2 group/btn"
            >
                <div className="bg-white/20 p-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M3 12h18M12 3v18" /><circle cx="12" cy="12" r="3" />
                    </svg>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest pr-2 hidden group-hover/btn:block">Volver a la tienda</span>
            </button>
        </div>
    );
}