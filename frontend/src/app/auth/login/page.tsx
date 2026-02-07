'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (data.user.role === 'admin') {
                    router.push('/admin');
                } else if (data.user.role === 'seller') {
                    router.push('/dashboard/seller');
                } else {
                    router.push('/dashboard/buyer');
                }
            } else {
                setError(data.message || 'فشل تسجيل الدخول');
            }
        } catch (err) {
            setError('خطأ في الاتصال بالخادم. تأكد من تشغيل Backend');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl font-bold">أ</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">أوبن لاند</h1>
                    <p className="text-gray-500 text-sm mt-1">منصة الأراضي الزراعية</p>
                </div>

                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                    <CardHeader className="text-center bg-gradient-to-r from-green-600 to-green-700 text-white py-6">
                        <CardTitle className="text-xl font-bold">تسجيل الدخول</CardTitle>
                        <CardDescription className="text-green-100">مرحباً بك مجدداً</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-5 p-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    البريد الإلكتروني
                                </label>
                                <div className="relative">
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pr-10 h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    كلمة المرور
                                </label>
                                <div className="relative">
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pr-10 h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-base font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        جاري الدخول...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <LogIn className="h-5 w-5" />
                                        دخول
                                    </span>
                                )}
                            </Button>

                            <div className="text-sm text-center text-gray-500">
                                ليس لديك حساب؟{' '}
                                <Link href="/auth/register" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                                    سجل الآن
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Footer */}
                <p className="text-center text-gray-400 text-xs mt-6">
                    © 2024 أوبن لاند - جميع الحقوق محفوظة
                </p>
            </div>
        </div>
    );
}
