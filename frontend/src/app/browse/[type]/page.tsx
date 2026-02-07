'use client';

import { useEffect, useState, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Land {
    id: number;
    title: string;
    price: number;
    area_m2: number;
    wilaya: string;
    type: string;
    description: string;
    media: { url: string; media_type: string }[];
}

const landTypeLabels: Record<string, string> = {
    concession: 'الأراضي التابعة للدولة (عقود امتياز)',
    private: 'الأراضي الخاصة التابعة للافراد',
    agricultural: 'أراضي زراعية',
    waqf: 'الأراضي الوقفية',
};

export default function BrowseLandType({ params }: { params: Promise<{ type: string }> }) {
    const { type } = use(params);
    const [lands, setLands] = useState<Land[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        serviceType: '',
        minArea: '',
        maxArea: '',
        minPrice: '',
        maxPrice: '',
        wilaya: '',
    });

    const fetchLands = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('type', type);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.minArea) params.append('minArea', filters.minArea);
            if (filters.maxArea) params.append('maxArea', filters.maxArea);
            if (filters.wilaya) params.append('wilaya', filters.wilaya);

            const response = await fetch(`http://localhost:5000/api/lands?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setLands(data);
            }
        } catch (error) {
            console.error('Failed to fetch lands:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLands();
    }, [type]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchLands();
    };

    const pageTitle = landTypeLabels[type] || 'الأراضي';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Modern design */}
            <section className="bg-white py-6 md:py-10 px-4 shadow-sm">
                <div className="max-w-6xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-3 md:mb-4 text-sm md:text-base transition-colors">
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                        <span>العودة للرئيسية</span>
                    </Link>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                        {pageTitle}
                    </h1>
                </div>
            </section>

            {/* Filter Bar - Modern responsive */}
            <section className="py-3 md:py-4 px-4 bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto">
                    <form onSubmit={handleSearch}>
                        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl shadow-lg">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                                <select
                                    className="bg-gray-600 border-none text-white text-xs md:text-sm rounded-lg p-2 md:p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={filters.serviceType}
                                    onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
                                >
                                    <option value="">نوع الخدمة</option>
                                    <option value="sale">للبيع</option>
                                    <option value="rent">للكراء</option>
                                </select>
                                <Input
                                    type="number"
                                    placeholder="المساحة (م²)"
                                    className="bg-gray-600 border-none text-white placeholder:text-gray-300 text-xs md:text-sm rounded-lg h-9 md:h-11"
                                    value={filters.minArea}
                                    onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    placeholder="السعر"
                                    className="bg-gray-600 border-none text-white placeholder:text-gray-300 text-xs md:text-sm rounded-lg h-9 md:h-11"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                />
                                <Input
                                    placeholder="الموقع"
                                    className="bg-gray-600 border-none text-white placeholder:text-gray-300 text-xs md:text-sm rounded-lg h-9 md:h-11"
                                    value={filters.wilaya}
                                    onChange={(e) => setFilters({ ...filters, wilaya: e.target.value })}
                                />
                                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-9 md:h-11 text-xs md:text-sm col-span-2 sm:col-span-1">
                                    بحث
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            {/* Results Grid - Modern responsive */}
            <section className="py-6 md:py-10 px-4">
                <div className="max-w-6xl mx-auto">
                    <p className="text-gray-500 text-sm mb-4 md:mb-6">
                        {loading ? 'جاري البحث...' : `تم العثور على ${lands.length} نتيجة`}
                    </p>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : lands.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                            {lands.map((land) => (
                                <Link href={`/lands/${land.id}`} key={land.id}>
                                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-0 shadow-md rounded-xl md:rounded-2xl hover:-translate-y-1">
                                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                            {land.media && land.media.length > 0 && land.media[0].media_type === 'image' ? (
                                                <img
                                                    src={`http://localhost:5000${land.media[0].url}`}
                                                    alt={land.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                                    <span className="text-green-600 text-3xl md:text-4xl">🌾</span>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-3 md:p-4">
                                            <p className="text-xs md:text-sm text-gray-600 mb-1">
                                                {land.type === 'agricultural' ? 'أرض زراعية' :
                                                    land.type === 'private' ? 'أرض خاصة' :
                                                        land.type === 'concession' ? 'عقد امتياز' :
                                                            land.type === 'waqf' ? 'أرض وقفية' : land.type}
                                            </p>
                                            <p className="text-base md:text-lg font-bold text-green-600">
                                                {land.price?.toLocaleString()} دج
                                            </p>
                                            <p className="text-xs md:text-sm text-gray-500">
                                                {land.area_m2} م²
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">للبيع</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
                                {[1, 2, 3, 4].map((i) => (
                                    <Card key={i} className="overflow-hidden border-2 border-dashed border-gray-200 rounded-xl md:rounded-2xl">
                                        <div className="aspect-square bg-gray-50 flex items-center justify-center">
                                            <span className="text-gray-300 text-xs md:text-sm">لا توجد أراضي</span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                            <p className="text-gray-500 mb-4">لا توجد أراضي متاحة في هذه الفئة حالياً</p>
                            <Link href="/dashboard/seller/add">
                                <Button className="rounded-xl">أضف أرضك الآن</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
