"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Ruler, Eye } from "lucide-react";

interface LandCardProps {
    id: number;
    title: string;
    price: number;
    area_m2: number;
    wilaya: string;
    type: string;
    service_type: string;
    media?: { url: string; media_type: string }[];
    showQuickView?: boolean;
}

const landTypes: Record<string, string> = {
    private: "أراضي الخواص",
    waqf: "أراضي وقفية",
    concession: "أراضي الدولة",
};

const serviceTypes: Record<string, string> = {
    sale: "للبيع",
    rent: "للكراء",
};

export default function LandCard({
    id,
    title,
    price,
    area_m2,
    wilaya,
    type,
    service_type,
    media,
    showQuickView = true,
}: LandCardProps) {
    const imageUrl = media && media.length > 0 && media[0].media_type === "image"
        ? `http://localhost:5000${media[0].url}`
        : null;

    return (
        <Link href={`/lands/${id}`}>
            <motion.div
                className="land-card group cursor-pointer h-full"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {/* Image Container */}
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                    {imageUrl ? (
                        <motion.img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.6 }}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-5xl opacity-50">🌾</span>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            {serviceTypes[service_type] || "للبيع"}
                        </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                        <span className="bg-primary/90 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
                            {landTypes[type] || type}
                        </span>
                    </div>

                    {/* Quick View Overlay */}
                    {showQuickView && (
                        <motion.div
                            className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={{ opacity: 0 }}
                        >
                            <div className="text-center text-white p-4">
                                <Eye className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-sm font-medium">عرض التفاصيل</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {title}
                    </h3>

                    <div className="flex items-center text-gray-500 text-sm gap-1.5 mb-1.5">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-primary/60" />
                        <span className="line-clamp-1">{wilaya}</span>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm gap-1.5 mb-3">
                        <Ruler className="h-4 w-4 flex-shrink-0 text-primary/60" />
                        <span>{area_m2?.toLocaleString()} م²</span>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                        <span className="text-xl font-bold text-primary">
                            {price?.toLocaleString()} <span className="text-sm font-normal">دج</span>
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
