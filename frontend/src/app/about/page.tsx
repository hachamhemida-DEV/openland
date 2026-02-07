"use client";

import { motion } from "framer-motion";
import { Target, Users, Shield, TrendingUp, CheckCircle } from "lucide-react";

const values = [
    {
        icon: Target,
        title: "الشفافية",
        description: "نضمن معاملات واضحة وموثقة بين جميع الأطراف"
    },
    {
        icon: Shield,
        title: "الأمان",
        description: "حماية بيانات المستخدمين ومعاملاتهم أولويتنا القصوى"
    },
    {
        icon: Users,
        title: "التواصل",
        description: "نربط بين أصحاب الأراضي والمستثمرين بفعالية"
    },
    {
        icon: TrendingUp,
        title: "التطوير",
        description: "نساهم في تنمية القطاع الفلاحي الجزائري"
    }
];

const stats = [
    { value: "500+", label: "هكتار مدرج" },
    { value: "1200+", label: "مستخدم مسجل" },
    { value: "48", label: "ولاية مغطاة" },
    { value: "100%", label: "ملاك موثقين" }
];

export default function AboutPage() {
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
                        من نحن
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl text-white/80 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        أوبن لاند هي أول منصة رقمية جزائرية متخصصة في الأراضي الزراعية،
                        تهدف إلى تسهيل عمليات البيع والكراء والاستثمار بشفافية وأمان.
                    </motion.p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 md:py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="bg-white rounded-3xl p-8 md:p-12 shadow-lg"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                            رسالتنا
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-lg mb-6">
                            نسعى لخلق فضاء موثوق يجمع بين أصحاب الأراضي الزراعية والمستثمرين،
                            من خلال توفير معلومات دقيقة وشفافة عن العقارات الفلاحية بمختلف أنواعها:
                            أراضي الدولة (الامتياز)، أراضي الخواص، والأراضي الوقفية.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            نؤمن بأن تطوير القطاع الفلاحي الجزائري يبدأ بتسهيل الوصول إلى الأراضي
                            وتوفير بيئة آمنة للمعاملات العقارية.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 md:py-20 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
                        قيمنا
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={value.title}
                                    className="bg-sand rounded-2xl p-6 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                                    <p className="text-sm text-gray-600">{value.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 md:py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="bg-white rounded-2xl p-6 text-center shadow-sm"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                    {stat.value}
                                </div>
                                <p className="text-gray-600 text-sm">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
