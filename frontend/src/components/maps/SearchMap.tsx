"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Land {
    id: number;
    title: string;
    price: number;
    wilaya: string;
    geom?: { coordinates: [number, number] };
}

interface SearchMapProps {
    lands: Land[];
    selectedLand: number | null;
    onSelectLand: (id: number | null) => void;
}

export default function SearchMap({ lands, selectedLand, onSelectLand }: SearchMapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("search-map", {
                center: [28.0339, 1.6596], // Algeria center
                zoom: 5,
                zoomControl: false,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(mapRef.current);

            // Add zoom control to bottom right
            L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        // Add new markers
        lands.forEach((land) => {
            if (land.geom?.coordinates) {
                const [lng, lat] = land.geom.coordinates;

                const isSelected = selectedLand === land.id;

                const icon = L.divIcon({
                    className: "custom-marker",
                    html: `
                        <div class="relative">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform ${isSelected
                            ? "bg-accent scale-125"
                            : "bg-primary hover:scale-110"
                        }">
                                <span class="text-white text-xs font-bold">
                                    ${Math.round(land.price / 1000000)}M
                                </span>
                            </div>
                            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${isSelected ? "border-t-accent" : "border-t-primary"
                        }"></div>
                        </div>
                    `,
                    iconSize: [40, 45],
                    iconAnchor: [20, 45],
                });

                const marker = L.marker([lat, lng], { icon })
                    .addTo(mapRef.current!)
                    .bindPopup(`
                        <div class="p-2 min-w-[200px]">
                            <h3 class="font-bold text-gray-900 mb-1">${land.title}</h3>
                            <p class="text-sm text-gray-500 mb-2">${land.wilaya}</p>
                            <p class="text-lg font-bold text-primary">${land.price.toLocaleString()} دج</p>
                            <a href="/lands/${land.id}" class="block mt-2 text-center bg-primary text-white py-2 rounded-lg text-sm">
                                عرض التفاصيل
                            </a>
                        </div>
                    `, { className: "custom-popup" });

                marker.on("click", () => onSelectLand(land.id));
                markersRef.current.push(marker);
            }
        });

        // Fit bounds if there are markers
        if (markersRef.current.length > 0) {
            const group = L.featureGroup(markersRef.current);
            mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
        }
    }, [lands, selectedLand, onSelectLand]);

    // Pan to selected land
    useEffect(() => {
        if (!mapRef.current || !selectedLand) return;

        const land = lands.find((l) => l.id === selectedLand);
        if (land?.geom?.coordinates) {
            const [lng, lat] = land.geom.coordinates;
            mapRef.current.panTo([lat, lng], { animate: true });
        }
    }, [selectedLand, lands]);

    return (
        <>
            <div id="search-map" className="w-full h-full" />
            <style jsx global>{`
                .custom-marker {
                    background: transparent;
                    border: none;
                }
                .custom-popup .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
                }
                .custom-popup .leaflet-popup-tip {
                    display: none;
                }
            `}</style>
        </>
    );
}
