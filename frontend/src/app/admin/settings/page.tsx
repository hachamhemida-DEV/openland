'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Save, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function AdminSettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [settings, setSettings] = useState({
        office_phone: '',
        office_whatsapp: '',
        office_email: '',
        office_address: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/settings');
                if (response.ok) {
                    const data = await response.json();
                    setSettings({
                        office_phone: data.office_phone || '',
                        office_whatsapp: data.office_whatsapp || '',
                        office_email: data.office_email || '',
                        office_address: data.office_address || ''
                    });
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setMessage('✅ تم حفظ الإعدادات بنجاح');
            } else {
                setMessage('❌ فشل في حفظ الإعدادات');
            }
        } catch (error) {
            setMessage('❌ خطأ في الاتصال بالخادم');
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
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.push('/admin')} className="gap-2 mb-4">
                    <ArrowRight className="h-4 w-4" />
                    العودة للوحة التحكم
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">إعدادات المكتب</h1>
                <p className="text-gray-500 mt-1">قم بتحديث معلومات التواصل التي تظهر للمستخدمين</p>
            </div>

            <Card>
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                    <CardTitle>معلومات التواصل</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    {message && (
                        <div className={`p-3 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2">
                            <Phone className="h-4 w-4 text-green-600" />
                            رقم الهاتف
                        </label>
                        <Input
                            value={settings.office_phone}
                            onChange={(e) => setSettings({ ...settings, office_phone: e.target.value })}
                            placeholder="+213 555 123 456"
                            dir="ltr"
                        />
                        <p className="text-xs text-gray-500 mt-1">الرقم الذي سيظهر في زر "اتصل بالإدارة"</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2">
                            <MessageCircle className="h-4 w-4 text-green-600" />
                            رقم الواتساب
                        </label>
                        <Input
                            value={settings.office_whatsapp}
                            onChange={(e) => setSettings({ ...settings, office_whatsapp: e.target.value })}
                            placeholder="213555123456"
                            dir="ltr"
                        />
                        <p className="text-xs text-gray-500 mt-1">بدون + أو مسافات (سيستخدم في رابط wa.me)</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                            البريد الإلكتروني
                        </label>
                        <Input
                            type="email"
                            value={settings.office_email}
                            onChange={(e) => setSettings({ ...settings, office_email: e.target.value })}
                            placeholder="contact@openland.dz"
                            dir="ltr"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2">
                            <MapPin className="h-4 w-4 text-red-600" />
                            العنوان
                        </label>
                        <Input
                            value={settings.office_address}
                            onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
                            placeholder="شارع ديدوش مراد، الجزائر العاصمة"
                        />
                    </div>

                    <Button onClick={handleSave} disabled={saving} className="w-full gap-2 mt-4">
                        <Save className="h-4 w-4" />
                        {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
