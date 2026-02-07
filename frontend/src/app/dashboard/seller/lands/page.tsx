'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Land {
    id: number;
    title: string;
    price: number;
    area: number;
    status: string;
    created_at: string;
    wilaya: string;
    media: { url: string; media_type: string }[];
}

export default function MyLandsPage() {
    const [lands, setLands] = useState<Land[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyLands = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/lands/my-lands', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

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

        fetchMyLands();
    }, []);

    if (loading) {
        return <p className="text-center py-12">جاري التحميل...</p>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">عقاراتي</h1>
                <Link href="/dashboard/seller/add">
                    <Button>إضافة عقار جديد</Button>
                </Link>
            </div>

            {lands.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {lands.map((land) => (
                        <Link href={`/lands/${land.id}`} key={land.id}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    {/* Image Preview */}
                                    <div className="w-full md:w-48 h-48 bg-gray-200 relative shrink-0">
                                        {land.media && land.media.length > 0 && land.media[0].media_type === 'image' ? (
                                            <img
                                                src={`http://localhost:5000${land.media[0].url}`}
                                                alt={land.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
                                                <span className="font-bold">OpenLand</span>
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-6 flex-1">
                                        <div className="flex justify-between items-start h-full">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold mb-2">{land.title}</h3>
                                                <p className="text-gray-600 mb-2">{land.wilaya}</p>
                                                <p className="text-sm text-gray-500">
                                                    المساحة: {land.area} م² • السعر: {land.price.toLocaleString()} دج
                                                </p>
                                                <p className="text-sm text-gray-400 mt-2">
                                                    تاريخ النشر: {new Date(land.created_at).toLocaleDateString('ar-DZ')}
                                                </p>
                                            </div>
                                            <div className="text-left">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${land.status === 'verified'
                                                        ? 'bg-green-100 text-green-800'
                                                        : land.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {land.status === 'verified'
                                                        ? '✓ موافق عليه'
                                                        : land.status === 'pending'
                                                            ? '⏳ قيد المراجعة'
                                                            : '✗ مرفوض'}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-gray-500 mb-4">لم تقم بنشر أي عقارات بعد</p>
                        <Link href="/dashboard/seller/add">
                            <Button>أضف عقارك الأول</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
