'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Save, Upload, Image, FileText, Video } from 'lucide-react';

export default function EditLandPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        area_m2: '',
        type: 'concession',
        service_type: 'sale',
        wilaya: '',
        baladia: ''
    });

    const landTypes = [
        { value: 'concession', label: 'أرض امتياز (دولة)' },
        { value: 'private', label: 'أرض خاصة' },
        { value: 'waqf', label: 'أرض وقفية' },
    ];

    const serviceTypes = [
        { value: 'sale', label: 'للبيع' },
        { value: 'rent', label: 'للإيجار' },
    ];

    useEffect(() => {
        const fetchLand = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/lands/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const land = await response.json();
                    setFormData({
                        title: land.title || '',
                        description: land.description || '',
                        price: land.price?.toString() || '',
                        area_m2: land.area_m2?.toString() || '',
                        type: land.type || 'concession',
                        service_type: land.service_type || 'sale',
                        wilaya: land.wilaya || '',
                        baladia: land.baladia || ''
                    });
                } else {
                    setError('فشل في تحميل بيانات العقار');
                }
            } catch (err) {
                setError('خطأ في الاتصال بالخادم');
            } finally {
                setLoading(false);
            }
        };

        fetchLand();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            // Use FormData to support file uploads
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('area_m2', formData.area_m2);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('service_type', formData.service_type);
            formDataToSend.append('wilaya', formData.wilaya);
            formDataToSend.append('baladia', formData.baladia);

            images.forEach((img) => formDataToSend.append('images', img));
            documents.forEach((doc) => formDataToSend.append('documents', doc));
            videos.forEach((vid) => formDataToSend.append('videos', vid));

            const response = await fetch(`http://localhost:5000/api/lands/my-lands/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend
            });

            if (response.ok) {
                alert('✅ تم تحديث الإعلان وإعادة إرساله للمراجعة');
                router.push('/dashboard/seller');
            } else {
                const data = await response.json();
                setError(data.message || 'فشل في تحديث الإعلان');
            }
        } catch (err) {
            setError('خطأ في الاتصال بالخادم');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2 mb-4">
                    <ArrowRight className="h-4 w-4" />
                    رجوع
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">تعديل الإعلان</h1>
                <p className="text-gray-500 mt-1">قم بتعديل المعلومات وإعادة إرسال الإعلان للمراجعة</p>
            </div>

            <Card>
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <CardTitle>تحديث معلومات العقار</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">عنوان الإعلان</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">السعر (دج)</label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">المساحة (م²)</label>
                                <Input
                                    type="number"
                                    value={formData.area_m2}
                                    onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">نوع الأرض</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full border rounded-lg p-2"
                                >
                                    {landTypes.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">نوع الخدمة</label>
                                <select
                                    value={formData.service_type}
                                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                    className="w-full border rounded-lg p-2"
                                >
                                    {serviceTypes.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">الولاية</label>
                                <Input
                                    value={formData.wilaya}
                                    onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">البلدية</label>
                                <Input
                                    value={formData.baladia}
                                    onChange={(e) => setFormData({ ...formData, baladia: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">الوصف</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border rounded-lg p-3 min-h-[120px]"
                                required
                            />
                        </div>

                        {/* File Upload Section */}
                        <div className="space-y-4 border-t pt-4 mt-4">
                            <h3 className="font-medium text-gray-900">إضافة ملفات جديدة (اختياري)</h3>

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Image className="inline h-4 w-4 mr-1" />
                                    صور جديدة
                                </label>
                                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => e.target.files && setImages(Array.from(e.target.files))}
                                        className="hidden"
                                        id="images-upload"
                                    />
                                    <label htmlFor="images-upload" className="cursor-pointer">
                                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">اضغط لاختيار صور</p>
                                        {images.length > 0 && (
                                            <p className="text-green-600 text-sm mt-1">تم اختيار {images.length} صور</p>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Documents */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <FileText className="inline h-4 w-4 mr-1" />
                                    وثائق الملكية
                                </label>
                                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        multiple
                                        onChange={(e) => e.target.files && setDocuments(Array.from(e.target.files))}
                                        className="hidden"
                                        id="docs-upload"
                                    />
                                    <label htmlFor="docs-upload" className="cursor-pointer">
                                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">اضغط لاختيار وثائق</p>
                                        {documents.length > 0 && (
                                            <p className="text-green-600 text-sm mt-1">تم اختيار {documents.length} وثائق</p>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Videos */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Video className="inline h-4 w-4 mr-1" />
                                    فيديوهات
                                </label>
                                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        multiple
                                        onChange={(e) => e.target.files && setVideos(Array.from(e.target.files))}
                                        className="hidden"
                                        id="videos-upload"
                                    />
                                    <label htmlFor="videos-upload" className="cursor-pointer">
                                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">اضغط لاختيار فيديوهات</p>
                                        {videos.length > 0 && (
                                            <p className="text-green-600 text-sm mt-1">تم اختيار {videos.length} فيديوهات</p>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 text-sm">
                                <strong>ملاحظة:</strong> بعد التعديل، سيتم إرسال الإعلان للمراجعة من جديد من قبل الإدارة.
                            </p>
                        </div>

                        <Button type="submit" disabled={saving} className="w-full gap-2">
                            <Save className="h-4 w-4" />
                            {saving ? 'جاري الحفظ...' : 'حفظ التعديلات وإعادة الإرسال'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
