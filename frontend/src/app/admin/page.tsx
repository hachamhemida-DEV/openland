'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, MapPin, Calendar, User, Eye, Trash2, Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalLands: 0,
        pendingLands: 0,
        verifiedLands: 0,
    });
    const [pendingLands, setPendingLands] = useState<any[]>([]);
    const [allLands, setAllLands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
    const [searchQuery, setSearchQuery] = useState('');

    // Check if user is admin
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/auth/login');
            return;
        }

        const user = JSON.parse(userStr);
        if (user.role !== 'admin') {
            alert('⛔ غير مصرح لك بالدخول! هذه الصفحة للمشرفين فقط');
            router.push('/');
            return;
        }

        setAuthorized(true);
    }, [router]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [statsRes, pendingRes, allRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/stats', { headers }),
                fetch('http://localhost:5000/api/admin/lands/pending', { headers }),
                fetch(`http://localhost:5000/api/admin/lands?search=${searchQuery}`, { headers })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (pendingRes.ok) setPendingLands(await pendingRes.json());
            if (allRes.ok) setAllLands(await allRes.json());

        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authorized) {
            fetchData();
        }
    }, [authorized, searchQuery]);

    const handleAction = async (id: number, status: 'verified' | 'rejected') => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/lands/${id}/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                fetchData();
                alert(`تم ${status === 'verified' ? 'الموافقة على' : 'رفض'} العقار بنجاح`);
            }
        } catch (error) {
            console.error('Action failed:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذا العقار؟')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/lands/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchData();
                alert('تم حذف العقار بنجاح');
            } else {
                alert('فشل حذف العقار');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('خطأ في حذف العقار');
        }
    };

    if (loading || !authorized) {
        return (
            <div className="p-8 text-center">
                <div className="animate-pulse">جاري التحقق من الصلاحيات...</div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">لوحة تحكم المشرف</h1>
                <Link href="/admin/settings">
                    <Button variant="outline" className="gap-2">
                        <Settings className="h-4 w-4" />
                        إعدادات المكتب
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-orange-50 border-orange-200">
                    <CardHeader>
                        <CardTitle className="text-orange-700">بانتظار الموافقة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-900">{stats.pendingLands}</div>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                        <CardTitle className="text-green-700">عقارات مفعلة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-900">{stats.verifiedLands}</div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-700">إجمالي العقارات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-900">{stats.totalLands}</div>
                    </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                        <CardTitle className="text-purple-700">المستخدمين</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-900">{stats.totalUsers}</div>
                    </CardContent>
                </Card>
            </div>


            {/* Search and Tabs */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="ابحث بالعنوان، الولاية، اسم المالك..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pr-10"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant={activeTab === 'pending' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('pending')}
                            className="gap-1"
                        >
                            <span className="hidden sm:inline">قيد المراجعة</span>
                            <span className="sm:hidden">مراجعة</span>
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">{pendingLands.length}</span>
                        </Button>
                        <Button
                            variant={activeTab === 'all' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('all')}
                            className="gap-1"
                        >
                            <span className="hidden sm:inline">جميع العقارات</span>
                            <span className="sm:hidden">الكل</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">{allLands.length}</span>
                        </Button>
                    </div>
                </div>

                {activeTab === 'pending' ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">عقارات بانتظار الموافقة ({pendingLands.length})</h2>
                        {pendingLands.length === 0 ? (
                            <p className="text-gray-500">لا توجد عقارات بانتظار الموافقة حالياً.</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingLands.map((land) => (
                                    <Card key={land.id}>
                                        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <h3 className="font-bold text-lg">{land.title}</h3>
                                                <div className="text-sm text-gray-500 space-y-1 mt-1">
                                                    <p className="flex items-center gap-1">
                                                        <User className="h-4 w-4" />
                                                        المالك: {land.owner?.full_name || land.owner?.email}
                                                    </p>
                                                    <p className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {land.wilaya} - {land.baladia}
                                                    </p>
                                                    <p className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(land.created_at).toLocaleDateString('ar-DZ')}
                                                    </p>
                                                    <p className="font-medium text-green-600">
                                                        {land.price.toLocaleString()} دج | {land.area_m2} م²
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto flex-wrap">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="flex-1 md:flex-none"
                                                    onClick={() => router.push(`/admin/lands/${land.id}`)}
                                                >
                                                    <Eye className="h-4 w-4 ml-1" /> عرض التفاصيل
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-1 md:flex-none"
                                                    onClick={() => handleAction(land.id, 'verified')}
                                                >
                                                    <Check className="h-4 w-4 ml-1" /> موافقة
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 md:flex-none"
                                                    onClick={() => handleAction(land.id, 'rejected')}
                                                >
                                                    <X className="h-4 w-4 ml-1" /> رفض
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="flex-1 md:flex-none"
                                                    onClick={() => handleDelete(land.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 ml-1" /> حذف
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-bold mb-4">جميع العقارات ({allLands.length})</h2>
                        {allLands.length === 0 ? (
                            <p className="text-gray-500">لا توجد عقارات.</p>
                        ) : (
                            <div className="space-y-4">
                                {allLands.map((land) => (
                                    <Card key={land.id}>
                                        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <h3 className="font-bold text-lg">{land.title}</h3>
                                                <div className="text-sm text-gray-500 space-y-1 mt-1">
                                                    <p className="flex items-center gap-1">
                                                        <User className="h-4 w-4" />
                                                        المالك: {land.owner?.full_name || land.owner?.email}
                                                    </p>
                                                    <p className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {land.wilaya} - {land.baladia}
                                                    </p>
                                                    <p className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(land.created_at).toLocaleDateString('ar-DZ')}
                                                    </p>
                                                    <p className="font-medium text-green-600">
                                                        {land.price.toLocaleString()} دج | {land.area_m2} م²
                                                    </p>
                                                    <p className="text-sm">
                                                        الحالة: <span className={`font-medium ${land.status === 'verified' ? 'text-green-600' :
                                                            land.status === 'pending' ? 'text-orange-600' :
                                                                'text-red-600'
                                                            }`}>
                                                            {land.status === 'verified' ? 'موثقة' :
                                                                land.status === 'pending' ? 'قيد المراجعة' :
                                                                    'مرفوضة'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto flex-wrap">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="flex-1 md:flex-none"
                                                    onClick={() => router.push(`/admin/lands/${land.id}`)}
                                                >
                                                    <Eye className="h-4 w-4 ml-1" /> عرض التفاصيل
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="flex-1 md:flex-none"
                                                    onClick={() => handleDelete(land.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 ml-1" /> حذف
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
