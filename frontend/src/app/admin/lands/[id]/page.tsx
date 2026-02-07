'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MapView from '@/components/maps/MapView';
import { MapPin, Tag, Ruler, Calendar, User, Phone, Mail, FileText, CheckCircle, XCircle, Edit, Save, X } from 'lucide-react';

export default function AdminLandDetails({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [land, setLand] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState<any>({});
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const landTypes = {
        private: 'أرض خاصة',
        waqf: 'وقف',
        concession: 'امتياز',
    };

    const serviceTypes = {
        sale: 'للبيع',
        rent: 'للكراء',
    };

    const landStatus = {
        verified: 'موثقة',
        pending: 'قيد المراجعة',
        rejected: 'مرفوضة',
    };

    useEffect(() => {
        const fetchLandDetails = async () => {
            try {
                console.log('[Admin Land Details] Fetching land ID:', id);
                const token = localStorage.getItem('token');
                console.log('[Admin Land Details] Token exists:', !!token);

                // Use admin endpoint to get full seller info
                const response = await fetch(`http://localhost:5000/api/lands/admin/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log('[Admin Land Details] Response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('[Admin Land Details] Error response:', errorData);
                    throw new Error(errorData.message || 'Failed to fetch land details');
                }

                const data = await response.json();
                console.log('[Admin Land Details] Land data:', data);
                setLand(data);
            } catch (err: any) {
                console.error('[Admin Land Details] Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLandDetails();
    }, [id]);

    const handleApprove = async () => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/lands/${id}/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'verified' })
            });

            if (response.ok) {
                alert('✅ تم الموافقة على العقار');
                router.push('/admin');
            } else {
                alert('❌ فشل في الموافقة على العقار');
            }
        } catch (err) {
            alert('❌ خطأ في الاتصال بالخادم');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('يرجى إدخال سبب الرفض');
            return;
        }
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/lands/${id}/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'rejected', rejection_reason: rejectionReason })
            });

            if (response.ok) {
                alert('✅ تم رفض العقار');
                router.push('/admin');
            } else {
                alert('❌ فشل في رفض العقار');
            }
        } catch (err) {
            alert('❌ خطأ في الاتصال بالخادم');
        } finally {
            setActionLoading(false);
            setShowRejectModal(false);
            setRejectionReason('');
        }
    };

    const startEdit = () => {
        setEditData({
            title: land.title,
            description: land.description,
            price: land.price,
            area_m2: land.area_m2,
            type: land.type,
            service_type: land.service_type,
            wilaya: land.wilaya,
            baladia: land.baladia,
        });
        setEditMode(true);
    };

    const handleSave = async () => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/lands/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editData)
            });

            if (response.ok) {
                const updated = await response.json();
                setLand({ ...land, ...editData });
                setEditMode(false);
                alert('✅ تم تحديث العقار بنجاح');
            } else {
                alert('❌ فشل في تحديث العقار');
            }
        } catch (err) {
            alert('❌ خطأ في الاتصال بالخادم');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!land) {
        return <div className="flex justify-center items-center h-screen">العقار غير موجود.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">تفاصيل العقار - مراجعة المشرف</h1>
                <div className="flex gap-2">
                    {!editMode ? (
                        <Button variant="outline" onClick={startEdit} className="gap-1">
                            <Edit className="h-4 w-4" />
                            تعديل
                        </Button>
                    ) : (
                        <>
                            <Button onClick={handleSave} disabled={actionLoading} className="gap-1 bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4" />
                                {actionLoading ? 'جاري الحفظ...' : 'حفظ'}
                            </Button>
                            <Button variant="outline" onClick={() => setEditMode(false)} className="gap-1">
                                <X className="h-4 w-4" />
                                إلغاء
                            </Button>
                        </>
                    )}
                    <Button variant="outline" onClick={() => router.back()}>
                        رجوع
                    </Button>
                </div>
            </div>

            {/* Edit Form */}
            {editMode && (
                <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4 text-blue-900">تعديل بيانات العقار</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">العنوان</label>
                                <Input
                                    value={editData.title}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">السعر (دج)</label>
                                <Input
                                    type="number"
                                    value={editData.price}
                                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">المساحة (م²)</label>
                                <Input
                                    type="number"
                                    value={editData.area_m2}
                                    onChange={(e) => setEditData({ ...editData, area_m2: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">نوع الأرض</label>
                                <select
                                    className="w-full border rounded-lg p-2"
                                    value={editData.type}
                                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                                >
                                    <option value="private">أرض خاصة</option>
                                    <option value="waqf">وقف</option>
                                    <option value="concession">امتياز</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">نوع الخدمة</label>
                                <select
                                    className="w-full border rounded-lg p-2"
                                    value={editData.service_type}
                                    onChange={(e) => setEditData({ ...editData, service_type: e.target.value })}
                                >
                                    <option value="sale">للبيع</option>
                                    <option value="rent">للكراء</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">الولاية</label>
                                <Input
                                    value={editData.wilaya}
                                    onChange={(e) => setEditData({ ...editData, wilaya: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">البلدية</label>
                                <Input
                                    value={editData.baladia}
                                    onChange={(e) => setEditData({ ...editData, baladia: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="block text-sm font-medium mb-1">الوصف</label>
                                <textarea
                                    className="w-full border rounded-lg p-2 min-h-[100px]"
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Title and Location */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{land.title}</h2>
                        <p className="mt-2 text-gray-500 flex items-center text-lg">
                            <MapPin className="h-5 w-5 ml-2" /> {land.wilaya}، {land.baladia}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <Tag className="h-6 w-6 mx-auto mb-2 text-primary" />
                            <p className="text-sm text-gray-500">النوع</p>
                            <p className="font-bold">{landTypes[land.type as keyof typeof landTypes]}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <Ruler className="h-6 w-6 mx-auto mb-2 text-primary" />
                            <p className="text-sm text-gray-500">المساحة</p>
                            <p className="font-bold">{land.area_m2.toLocaleString()} م²</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                            <p className="text-sm text-gray-500">تاريخ النشر</p>
                            <p className="font-bold">{new Date(land.created_at).toLocaleDateString('ar-DZ')}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <Tag className="h-6 w-6 mx-auto mb-2 text-primary" />
                            <p className="text-sm text-gray-500">الحالة</p>
                            <p className={`font-bold ${land.status === 'verified' ? 'text-green-600' : land.status === 'pending' ? 'text-orange-600' : 'text-red-600'}`}>
                                {landStatus[land.status as keyof typeof landStatus]}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">الوصف</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {land.description}
                        </p>
                    </div>

                    {/* Images */}
                    {land.media && land.media.some((m: any) => m.media_type === 'image') && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">صور العقار</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {land.media.filter((m: any) => m.media_type === 'image').map((image: any) => (
                                    <img
                                        key={image.id}
                                        src={`http://localhost:5000${image.url}`}
                                        alt="صورة العقار"
                                        className="w-full h-48 object-cover rounded-lg border"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Videos */}
                    {land.media && land.media.some((m: any) => m.media_type === 'video') && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">فيديو توضيحي</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {land.media.filter((m: any) => m.media_type === 'video').map((video: any) => (
                                    <video
                                        key={video.id}
                                        controls
                                        className="w-full rounded-lg border bg-black"
                                    >
                                        <source src={`http://localhost:5000${video.url}`} type="video/mp4" />
                                        متصفحك لا يدعم تشغيل الفيديو.
                                    </video>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">وثائق الملكية</h3>
                        {land.documents && land.documents.length > 0 ? (
                            <div className="space-y-2">
                                {land.documents.map((doc: any) => (
                                    <a
                                        key={doc.id}
                                        href={`http://localhost:5000${doc.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <FileText className="h-5 w-5 text-primary" />
                                        <span className="font-medium">وثيقة {doc.id}</span>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                <FileText className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                                <p className="text-yellow-800 font-medium">لا توجد وثائق ملكية مرفقة</p>
                                <p className="text-yellow-600 text-sm">المعلن لم يرفق أي وثائق</p>
                            </div>
                        )}
                    </div>

                    {/* Map */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">الموقع على الخريطة</h3>
                        <div className="h-[400px] rounded-xl overflow-hidden border bg-gray-100">
                            {land.geom && land.geom.coordinates ? (
                                <MapView
                                    lat={land.geom.coordinates[1]}
                                    lng={land.geom.coordinates[0]}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    الموقع غير محدد
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Price Card */}
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-gray-500 mb-1">السعر الإجمالي</p>
                            <div className="text-3xl font-bold text-primary mb-4">
                                {land.price.toLocaleString()} دج
                            </div>

                            {/* Admin Actions */}
                            {land.status === 'pending' && (
                                <div className="space-y-3">
                                    <Button
                                        className="w-full"
                                        onClick={handleApprove}
                                        disabled={actionLoading}
                                    >
                                        <CheckCircle className="ml-2 h-4 w-4" />
                                        {actionLoading ? 'جاري التنفيذ...' : 'الموافقة على العقار'}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => setShowRejectModal(true)}
                                        disabled={actionLoading}
                                    >
                                        <XCircle className="ml-2 h-4 w-4" />
                                        رفض العقار
                                    </Button>
                                </div>
                            )}

                            {land.status === 'verified' && (
                                <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
                                    <p className="text-green-800 font-medium">تمت الموافقة على هذا العقار</p>
                                </div>
                            )}

                            {land.status === 'rejected' && (
                                <div className="bg-red-50 border border-red-200 rounded p-3">
                                    <p className="text-red-800 font-medium text-center mb-2">تم رفض هذا العقار</p>
                                    {land.rejection_reason && (
                                        <p className="text-red-700 text-sm">السبب: {land.rejection_reason}</p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Owner Info */}
                    {land.owner && (
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-4">معلومات المعلن</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{land.owner.full_name || 'مستخدم'}</p>
                                        <p className="text-sm text-gray-500">
                                            عضو منذ {new Date(land.created_at).getFullYear()}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Phone className="h-5 w-5 text-green-600" />
                                            {(land.contact_phone || land.owner.phone) ? (
                                                <span className="font-medium" dir="ltr">{land.contact_phone || land.owner.phone}</span>
                                            ) : (
                                                <span className="text-gray-500">لم يتم إضافة رقم الهاتف</span>
                                            )}
                                        </div>
                                        {(land.contact_phone || land.owner.phone) && (
                                            <a href={`tel:${land.contact_phone || land.owner.phone}`}>
                                                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100">
                                                    اتصال
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                                        <Mail className="h-5 w-5 text-blue-600" />
                                        <span className="truncate">{land.owner.email}</span>
                                    </div>
                                </div>

                                {/* Message Form */}
                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-medium mb-3">إرسال رسالة للمعلن</h4>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const form = e.target as HTMLFormElement;
                                        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
                                        if (!message.trim()) return;

                                        try {
                                            const token = localStorage.getItem('token');
                                            const response = await fetch('http://localhost:5000/api/messages', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`
                                                },
                                                body: JSON.stringify({
                                                    receiver_id: land.owner.id,
                                                    land_id: land.id,
                                                    content: message
                                                })
                                            });
                                            if (response.ok) {
                                                alert('✅ تم إرسال الرسالة بنجاح');
                                                form.reset();
                                            } else {
                                                alert('❌ فشل في إرسال الرسالة');
                                            }
                                        } catch (err) {
                                            alert('❌ خطأ في الاتصال');
                                        }
                                    }}>
                                        <textarea
                                            name="message"
                                            placeholder="اكتب رسالتك هنا..."
                                            className="w-full border rounded-lg p-3 text-sm min-h-[100px] resize-none mb-3"
                                            required
                                        />
                                        <Button type="submit" className="w-full">
                                            <Mail className="h-4 w-4 ml-2" />
                                            إرسال الرسالة
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Rejection Reason Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">سبب رفض العقار</h3>
                        <p className="text-gray-600 mb-4 text-sm">أدخل سبب رفض هذا العقار ليتم إبلاغ المعلن</p>

                        <div className="space-y-3 mb-4">
                            <button
                                type="button"
                                onClick={() => setRejectionReason('عدم إرفاق وثائق الملكية')}
                                className={`w-full text-right p-3 border rounded-lg hover:bg-gray-50 transition ${rejectionReason === 'عدم إرفاق وثائق الملكية' ? 'border-red-500 bg-red-50' : ''}`}
                            >
                                عدم إرفاق وثائق الملكية
                            </button>
                            <button
                                type="button"
                                onClick={() => setRejectionReason('معلومات غير صحيحة')}
                                className={`w-full text-right p-3 border rounded-lg hover:bg-gray-50 transition ${rejectionReason === 'معلومات غير صحيحة' ? 'border-red-500 bg-red-50' : ''}`}
                            >
                                معلومات غير صحيحة
                            </button>
                            <button
                                type="button"
                                onClick={() => setRejectionReason('صور غير واضحة أو غير كافية')}
                                className={`w-full text-right p-3 border rounded-lg hover:bg-gray-50 transition ${rejectionReason === 'صور غير واضحة أو غير كافية' ? 'border-red-500 bg-red-50' : ''}`}
                            >
                                صور غير واضحة أو غير كافية
                            </button>
                        </div>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="أو اكتب سبب مخصص..."
                            className="w-full border rounded-lg p-3 min-h-[80px] mb-4"
                        />

                        <div className="flex gap-3">
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={actionLoading || !rejectionReason.trim()}
                                className="flex-1"
                            >
                                {actionLoading ? 'جاري الرفض...' : 'تأكيد الرفض'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => { setShowRejectModal(false); setRejectionReason(''); }}
                                className="flex-1"
                            >
                                إلغاء
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
