'use client';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useState, useCallback, useMemo } from 'react';

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number;
    initialLng?: number;
}

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
};

const defaultCenter = {
    lat: 36.752887, // Algiers
    lng: 3.042048,
};

export default function MapPicker({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    const [marker, setMarker] = useState(
        initialLat && initialLng ? { lat: initialLat, lng: initialLng } : defaultCenter
    );

    const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarker({ lat, lng });
            onLocationSelect(lat, lng);
        }
    }, [onLocationSelect]);

    const center = useMemo(() => (initialLat && initialLng ? { lat: initialLat, lng: initialLng } : defaultCenter), [initialLat, initialLng]);

    if (!isLoaded) return <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">جاري تحميل الخريطة...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onClick={onMapClick}
        >
            <Marker position={marker} />
        </GoogleMap>
    );
}
