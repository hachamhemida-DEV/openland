"use client";

import { motion } from "framer-motion";
import { Search, FileCheck, Phone, Handshake } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
    {
        icon: Search,
        title: "ابحث عن أرض",
        description: "استخدم محرك البحث المتقدم للعثور على الأرض المناسبة حسب الولاية، النوع، والميزانية",
        color: "from-blue-500 to-blue-600"
    },
    {
        icon: FileCheck,
        title: "راجع التفاصيل",
        description: "اطلع على جميع المعلومات: المساحة، السعر، الحالة القانونية، والبنية التحتية المتوفرة",
        color: "from-primary to-primary-dark"
    },
    {
        icon: Phone,
        title: "تواصل معنا",
        description: "اتصل بفريق أوبن لاند للحصول على مزيد من المعلومات وترتيب زيارة للموقع",
        color: "from-accent to-accent-dark"
    },
    {
        icon: Handshake,
        title: "أتمم الصفقة",
        description: "نساعدك في إتمام المعاملة بشكل آمن وموثق مع جميع الإجراءات القانونية اللازمة",
        color: "from-emerald-500 to-emerald-600"
    }
];

const forSellers = [
    "سجل حساباً مجانياً كبائع",
    "أضف تفاصيل أرضك مع الصور",
    "انتظر التحقق من فريقنا",
    "استقبل استفسارات المهتمين"
];

const forBuyers = [
    "تصفح الأراضي المتاحة",
    "استخدم الفلاتر لتضييق البحث",
    "تواصل معنا للاستفسار",
    "احجز زيارة للموقع"
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-sand">
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20 md:py-28">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.h1
                        className="text-3xl md:text-5xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        كيف يعمل أوبن لاند؟
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl text-white/80"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        خطوات بسيطة للبيع أو الشراء أو الاستثمار في الأراضي الزراعية
                    </motion.p>
                </div>
            </section>

            {/* Steps */}
            <section className="py-16 md:py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.title}
                                    className="bg-white rounded-2xl p-6 text-center shadow-lg relative"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="absolute -top-4 right-1/2 translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 mt-4`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* For Sellers & Buyers */}
            <section className="py-16 md:py-20 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* For Sellers */}
                        <motion.div
                            className="bg-primary/5 rounded-3xl p-8"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">للبائعين</h3>
                            <ul className="space-y-4">
                                {forSellers.map((item, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/auth/register" className="block mt-6">
                                <Button className="w-full rounded-xl">
                                    سجل كبائع الآن
                                </Button>
                            </Link>
                        </motion.div>

                        {/* For Buyers */}
                        <motion.div
                            className="bg-accent/10 rounded-3xl p-8"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">للمشترين</h3>
                            <ul className="space-y-4">
                                {forBuyers.map((item, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/search" className="block mt-6">
                                <Button className="w-full rounded-xl bg-accent hover:bg-accent-dark text-accent-foreground">
                                    ابدأ البحث
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
