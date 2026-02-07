"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Ruler, Search, SlidersHorizontal, X, Map, List, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LandCard from "@/components/LandCard";
import { LandCardSkeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Dynamic import for map to avoid SSR issues
const MapWithNoSSR = dynamic(
    () => import("@/components/maps/SearchMap"),
    { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" /> }
);

interface Land {
    id: number;
    title: string;
    price: number;
    area_m2: number;
    wilaya: string;
    type: string;
    service_type: string;
    description: string;
    media: { url: string; media_type: string }[];
    geom?: { coordinates: [number, number] };
}

const landTypes: Record<string, string> = {
    concession: "أراضي الدولة",
    private: "أراضي الخواص",
    waqf: "أراضي وقفية",
};

const serviceTypes: Record<string, string> = {
    sale: "للبيع",
    rent: "للكراء",
};

const wilayas = [
    "الجزائر", "وهران", "قسنطينة", "البليدة", "سطيف",
    "باتنة", "بجاية", "تلمسان", "تيزي وزو", "عنابة"
];

function SearchContent() {
    const searchParams = useSearchParams();
    const [lands, setLands] = useState<Land[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [selectedLand, setSelectedLand] = useState<number | null>(null);

    const [filters, setFilters] = useState({
        wilaya: searchParams.get("wilaya") || "",
        landType: searchParams.get("type") || "",
        serviceType: searchParams.get("service_type") || "",
        minPrice: "",
        maxPrice: "",
    });

    const fetchLands = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.wilaya) params.append("wilaya", filters.wilaya);
            if (filters.landType) params.append("type", filters.landType);
            if (filters.serviceType) params.append("service_type", filters.serviceType);

            const response = await fetch(`http://localhost:5000/api/lands?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setLands(data);
            }
        } catch (error) {
            console.error("Failed to fetch lands:", error);
        } finally {
            setLoading(false);
        }
    }, [filters.wilaya, filters.landType, filters.serviceType]);

    useEffect(() => {
        fetchLands();
    }, [fetchLands]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchLands();
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({
            wilaya: "",
            landType: "",
            serviceType: "",
            minPrice: "",
            maxPrice: "",
        });
    };

    const activeFiltersCount = Object.values(filters).filter((v) => v !== "").length;

    return (
        <div className="min-h-screen bg-sand">
            {/* Header with Filters */}
            <div className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <form onSubmit={handleSearch}>
                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Wilaya Filter */}
                            <div className="relative flex-1 min-w-[150px] max-w-[200px]">
                                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select
                                    value={filters.wilaya}
                                    onChange={(e) => setFilters({ ...filters, wilaya: e.target.value })}
                                    className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">كل الولايات</option>
                                    {wilayas.map((w) => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Land Type Filter */}
                            <select
                                value={filters.landType}
                                onChange={(e) => setFilters({ ...filters, landType: e.target.value })}
                                className="flex-1 min-w-[140px] max-w-[180px] pr-4 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">نوع الأرض</option>
                                <option value="concession">أراضي الدولة</option>
                                <option value="private">أراضي الخواص</option>
                                <option value="waqf">أراضي وقفية</option>
                            </select>

                            {/* Service Type Filter */}
                            <select
                                value={filters.serviceType}
                                onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
                                className="flex-1 min-w-[100px] max-w-[140px] pr-4 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">الكل</option>
                                <option value="sale">للبيع</option>
                                <option value="rent">للكراء</option>
                            </select>

                            {/* Search Button */}
                            <Button type="submit" className="rounded-xl gap-2 bg-primary hover:bg-primary-dark">
                                <Search className="h-4 w-4" />
                                بحث
                            </Button>

                            {/* Clear Filters */}
                            {activeFiltersCount > 0 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-4 w-4 ml-1" />
                                    مسح ({activeFiltersCount})
                                </Button>
                            )}

                            {/* View Toggle (Desktop) */}
                            <div className="hidden lg:flex items-center gap-1 mr-auto bg-gray-100 rounded-xl p-1">
                                <button
                                    type="button"
                                    onClick={() => setShowMap(false)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!showMap ? "bg-white shadow text-primary" : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowMap(true)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${showMap ? "bg-white shadow text-primary" : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <Map className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                            {loading ? "جاري البحث..." : `${lands.length} نتيجة`}
                        </h1>
                        {!loading && lands.length > 0 && (
                            <p className="text-sm text-gray-500">الأراضي المتاحة حالياً</p>
                        )}
                    </div>
                </div>

                {/* Split View for Desktop */}
                <div className={`flex gap-6 ${showMap ? "lg:flex-row" : ""}`}>
                    {/* Land Cards Grid/List */}
                    <motion.div
                        className={showMap ? "lg:w-[45%] hidden lg:block" : "w-full"}
                        layout
                    >
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <LandCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : lands.length > 0 ? (
                            <div className={`grid gap-5 ${showMap
                                    ? "grid-cols-1"
                                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                }`}>
                                {lands.map((land, index) => (
                                    <motion.div
                                        key={land.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        onMouseEnter={() => setSelectedLand(land.id)}
                                        onMouseLeave={() => setSelectedLand(null)}
                                    >
                                        <LandCard {...land} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                className="text-center py-16"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="h-12 w-12 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد نتائج</h3>
                                <p className="text-gray-500 mb-6">جرب تغيير معايير البحث</p>
                                <Button
                                    onClick={() => {
                                        clearFilters();
                                        fetchLands();
                                    }}
                                    className="rounded-xl"
                                >
                                    عرض جميع الأراضي
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Map View (Desktop) */}
                    {showMap && (
                        <motion.div
                            className="hidden lg:block lg:w-[55%] sticky top-36 h-[calc(100vh-180px)] rounded-2xl overflow-hidden shadow-xl"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <MapWithNoSSR
                                lands={lands}
                                selectedLand={selectedLand}
                                onSelectLand={setSelectedLand}
                            />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Mobile FAB for Map */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:hidden z-50">
                <motion.button
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full shadow-xl font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMap(!showMap)}
                >
                    {showMap ? (
                        <>
                            <List className="h-5 w-5" />
                            عرض القائمة
                        </>
                    ) : (
                        <>
                            <Map className="h-5 w-5" />
                            عرض الخريطة
                        </>
                    )}
                </motion.button>
            </div>

            {/* Mobile Map Modal */}
            <AnimatePresence>
                {showMap && (
                    <motion.div
                        className="fixed inset-0 z-50 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="h-full">
                            <MapWithNoSSR
                                lands={lands}
                                selectedLand={selectedLand}
                                onSelectLand={setSelectedLand}
                            />
                        </div>
                        <button
                            className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-xl"
                            onClick={() => setShowMap(false)}
                        >
                            <X className="h-6 w-6 text-gray-700" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center h-screen bg-sand">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                        <p className="text-gray-500">جاري التحميل...</p>
                    </div>
                </div>
            }
        >
            <SearchContent />
        </Suspense>
    );
}
