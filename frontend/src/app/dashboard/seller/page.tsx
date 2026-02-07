'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, Eye, MessageSquare } from 'lucide-react';

interface Land {
    id: number;
    title: string;
    price: number;
    status: string;
    created_at: string;
}

export default function SellerDashboard() {
    const [lands, setLands] = useState<Land[]>([]);
    const [stats, setStats] = useState({
        totalListings: 0,
        totalViews: 0,
        unreadMessages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Get user info from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserName(user.full_name || user.email);
        }

        // Fetch seller's lands
        const fetchLands = async () => {
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
                    setStats({
                        totalListings: data.length,
                        totalViews: data.reduce((sum: number, land: any) => sum + (land.view_count || 0), 0),
                        unreadMessages: 0, // TODO: Implement messages count
                    });
                }
            } catch (error) {
                console.error('Failed to fetch lands:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLands();
    }, []);

    if (loading) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-500">جاري التحميل...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">نظرة عامة</h1>
                <p className="text-gray-500 mt-1">مرحباً، {userName}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي العقارات</CardTitle>
                        <List className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalListings}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.totalListings === 0 ? 'لا توجد عقارات بعد' : 'عقار نشط'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي المشاهدات</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews}</div>
                        <p className="text-xs text-muted-foreground">مشاهدة حتى الآن</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">رسائل غير مقروءة</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                        <p className="text-xs text-muted-foreground">رسالة جديدة</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Listings */}
            <div>
                <h2 className="text-xl font-bold mb-4">
                    {lands.length > 0 ? 'العقارات المنشورة' : 'لا توجد عقارات منشورة'}
                </h2>
                {lands.length > 0 ? (
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {lands.map((land) => (
                                    <tr key={land.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{land.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded ${land.status === 'verified' ? 'bg-green-100 text-green-800' :
                                                land.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {land.status === 'verified' ? 'نشط' : land.status === 'pending' ? 'قيد المراجعة' : land.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {land.price.toLocaleString()} دج
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(land.created_at).toLocaleDateString('ar-DZ')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-gray-500">لم تقم بنشر أي عقارات بعد</p>
                            <p className="text-sm text-gray-400 mt-2">اضغط على "إضافة عقار" لبدء النشر</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
