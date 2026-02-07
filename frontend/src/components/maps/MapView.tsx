'use client';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useMemo } from 'react';

interface MapViewProps {
    lat: number;
    lng: number;
}

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
};

export default function MapView({ lat, lng }: MapViewProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    const center = useMemo(() => ({ lat, lng }), [lat, lng]);

    if (!isLoaded) return <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">جاري تحميل الخريطة...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
        >
            <Marker position={center} />
        </GoogleMap>
    );
}
