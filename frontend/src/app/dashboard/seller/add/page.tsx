'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, MapPin, Tag, DollarSign, Ruler, Building2, Phone, Mail } from 'lucide-react';
import { landSchema, type LandFormValues } from '@/lib/schemas';
import MapPicker from '@/components/maps/MapPicker';

export default function AddLandPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            setShowLoginPopup(true);
        } else {
            setIsAuthenticated(true);
        }
        setCheckingAuth(false);
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LandFormValues>({
        resolver: zodResolver(landSchema),
        defaultValues: {
            land_type: 'concession',
            service_type: 'sale',
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDocuments(Array.from(e.target.files));
        }
    };

    const onSubmit = async (data: LandFormValues) => {
        setLoading(true);
        setServerError('');

        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();

            formDataToSend.append('title', data.title);
            formDataToSend.append('description', data.description);
            formDataToSend.append('price', data.price);
            formDataToSend.append('area_m2', data.area);
            formDataToSend.append('type', data.land_type);
            formDataToSend.append('service_type', data.service_type);
            formDataToSend.append('wilaya', data.wilaya);
            formDataToSend.append('baladia', data.baladia);
            formDataToSend.append('phone', data.phone);
            formDataToSend.append('email', data.email);

            if (location) {
                formDataToSend.append('lat', location.lat.toString());
                formDataToSend.append('lng', location.lng.toString());
            } else {
                formDataToSend.append('lat', '36.752887');
                formDataToSend.append('lng', '3.042048');
            }

            images.forEach((image) => formDataToSend.append('images', image));
            documents.forEach((doc) => formDataToSend.append('documents', doc));
            videos.forEach((video) => formDataToSend.append('videos', video));

            // 60 second timeout for heavy uploads
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);

            try {
                const response = await fetch('http://localhost:5000/api/lands', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formDataToSend,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    alert('✅ تم نشر العقار بنجاح! في انتظار موافقة المشرف.');
                    router.push('/dashboard/seller');
                } else {
                    const responseData = await response.json();
                    if (responseData.errors) {
                        const errorMessages = responseData.errors.map((err: any) => err.msg).join(', ');
                        setServerError(errorMessages);
                    } else {
                        setServerError(responseData.message || 'فشل نشر العقار');
                    }
                }
            } catch (err: any) {
                clearTimeout(timeoutId);
                if (err.name === 'AbortError') {
                    setServerError('انتهت مهلة الطلب (60 ثانية). يرجى التحقق من سرعة الإنترنت أو تقليل حجم الصور.');
                } else {
                    console.error('Submission error:', err);
                    setServerError('خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
                }
            }
        } catch (err) {
            console.error('Submission error:', err);
            setServerError('خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking auth
    if (checkingAuth) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    // Show login popup if not authenticated
    if (showLoginPopup) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">يجب تسجيل الدخول أولاً</h2>
                    <p className="text-gray-500 mb-6">لإضافة أرضك على المنصة، يرجى تسجيل الدخول أو إنشاء حساب جديد</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={() => router.push('/auth/login?redirect=/dashboard/seller/add')}
                            className="flex-1"
                        >
                            تسجيل الدخول
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/auth/register')}
                            className="flex-1"
                        >
                            حساب جديد
                        </Button>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                    >
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto py-6 md:py-8 px-4">
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">إضافة عقار جديد</h1>
                <p className="text-gray-500 mt-1">أضف أرضك للعرض على المنصة</p>
            </div>

            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 md:py-5">
                    <CardTitle className="text-lg md:text-xl">معلومات الأرض</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {serverError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {serverError}
                            </div>
                        )}

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    <Tag className="inline h-4 w-4 ml-1 text-green-600" />
                                    عنوان الأرض *
                                </label>
                                <Input
                                    {...register('title')}
                                    placeholder="مثال: أرض فلاحية خصبة بالبليدة"
                                    className="h-11 rounded-xl"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                            </div>

                            {/* Land Type - Only 3 options (no زراعي) */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    <Building2 className="inline h-4 w-4 ml-1 text-green-600" />
                                    نوع الأرض *
                                </label>
                                <select
                                    {...register('land_type')}
                                    className="w-full border rounded-xl p-3 h-11 text-sm bg-white"
                                >
                                    <option value="concession">أراضي الدولة (عقود امتياز)</option>
                                    <option value="private">أراضي الخواص (الأفراد)</option>
                                    <option value="waqf">أراضي وقفية</option>
                                </select>
                                {errors.land_type && <p className="text-red-500 text-xs mt-1">{errors.land_type.message}</p>}
                            </div>

                            {/* Service Type */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    <Tag className="inline h-4 w-4 ml-1 text-green-600" />
                                    نوع الخدمة *
                                </label>
                                <select
                                    {...register('service_type')}
                                    className="w-full border rounded-xl p-3 h-11 text-sm bg-white"
                                >
                                    <option value="sale">للبيع</option>
                                    <option value="rent">للكراء</option>
                                </select>
                                {errors.service_type && <p className="text-red-500 text-xs mt-1">{errors.service_type.message}</p>}
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    <DollarSign className="inline h-4 w-4 ml-1 text-green-600" />
                                    السعر (دج) *
                                </label>
                                <Input
                                    type="number"
                                    {...register('price')}
                                    placeholder="مثال: 12000000"
                                    className="h-11 rounded-xl"
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                            </div>

                            {/* Area */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    <Ruler className="inline h-4 w-4 ml-1 text-green-600" />
                                    المساحة (متر مربع) *
                                </label>
                                <Input
                                    type="number"
                                    {...register('area')}
                                    placeholder="مثال: 5000"
                                    className="h-11 rounded-xl"
                                />
                                {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
                            </div>

                            {/* Wilaya */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    <MapPin className="inline h-4 w-4 ml-1 text-green-600" />
                                    الولاية *
                                </label>
                                <Input
                                    {...register('wilaya')}
                                    placeholder="مثال: البليدة"
                                    className="h-11 rounded-xl"
                                />
                                {errors.wilaya && <p className="text-red-500 text-xs mt-1">{errors.wilaya.message}</p>}
                            </div>

                            {/* Baladia */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    <MapPin className="inline h-4 w-4 ml-1 text-green-600" />
                                    البلدية *
                                </label>
                                <Input
                                    {...register('baladia')}
                                    placeholder="مثال: بوفاريك"
                                    className="h-11 rounded-xl"
                                />
                                {errors.baladia && <p className="text-red-500 text-xs mt-1">{errors.baladia.message}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    <Phone className="inline h-4 w-4 ml-1 text-green-600" />
                                    رقم الهاتف *
                                </label>
                                <Input
                                    type="tel"
                                    {...register('phone')}
                                    placeholder="مثال: 0550123456"
                                    className="h-11 rounded-xl"
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    <Mail className="inline h-4 w-4 ml-1 text-green-600" />
                                    البريد الإلكتروني *
                                </label>
                                <Input
                                    type="email"
                                    {...register('email')}
                                    placeholder="example@email.com"
                                    className="h-11 rounded-xl"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">الوصف *</label>
                            <textarea
                                {...register('description')}
                                className="w-full border rounded-xl p-3 min-h-28 text-sm"
                                placeholder="وصف تفصيلي للأرض (الموقع، طبيعة التربة، المميزات...)"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>

                        {/* Map Picker */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                <MapPin className="inline h-4 w-4 ml-1 text-green-600" />
                                تحديد الموقع على الخريطة
                            </label>
                            <div className="border rounded-xl overflow-hidden">
                                <MapPicker onLocationSelect={(lat, lng) => setLocation({ lat, lng })} />
                            </div>
                            {location && (
                                <p className="text-sm text-green-600 mt-2 bg-green-50 px-3 py-2 rounded-lg">
                                    ✓ تم تحديد الموقع: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                </p>
                            )}
                        </div>

                        {/* File Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    <Upload className="inline h-4 w-4 ml-1 text-green-600" />
                                    صور الأرض
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="w-full text-sm"
                                />
                                {images.length > 0 && (
                                    <p className="text-xs text-green-600 mt-2">✓ {images.length} صورة</p>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    <Upload className="inline h-4 w-4 ml-1 text-green-600" />
                                    وثائق الملكية
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    multiple
                                    onChange={handleDocumentChange}
                                    className="w-full text-sm"
                                />
                                {documents.length > 0 && (
                                    <p className="text-xs text-green-600 mt-2">✓ {documents.length} ملف</p>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    <Upload className="inline h-4 w-4 ml-1 text-green-600" />
                                    فيديو (اختياري)
                                </label>
                                <input
                                    type="file"
                                    accept="video/mp4,video/webm"
                                    multiple
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setVideos(Array.from(e.target.files));
                                        }
                                    }}
                                    className="w-full text-sm"
                                />
                                {videos.length > 0 && (
                                    <p className="text-xs text-green-600 mt-2">✓ {videos.length} فيديو</p>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-12 rounded-xl text-base font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        جاري النشر...
                                    </span>
                                ) : 'نشر الأرض'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="h-12 rounded-xl px-8"
                            >
                                إلغاء
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
