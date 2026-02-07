"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plus, ArrowLeft, Building2, Users, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchWidget from "@/components/SearchWidget";
import BentoGrid from "@/components/BentoGrid";
import LandCard from "@/components/LandCard";
import { LandCardSkeleton } from "@/components/ui/skeleton";

interface Land {
    id: number;
    title: string;
    price: number;
    area_m2: number;
    wilaya: string;
    type: string;
    service_type: string;
    media: { url: string; media_type: string }[];
}

const landCategories = [
    {
        type: "concession",
        title: "أراضي الدولة",
        subtitle: "عقود امتياز",
        icon: Building2,
        gradient: "from-primary to-primary-dark",
    },
    {
        type: "private",
        title: "أراضي الخواص",
        subtitle: "الأفراد",
        icon: Users,
        gradient: "from-accent to-accent-dark",
    },
    {
        type: "waqf",
        title: "أراضي وقفية",
        subtitle: "أوقاف",
        icon: Landmark,
        gradient: "from-emerald-500 to-emerald-700",
    },
];

export default function Home() {
    const [featuredLands, setFeaturedLands] = useState<Land[]>([]);
    const [loading, setLoading] = useState(true);
    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    useEffect(() => {
        const fetchFeaturedLands = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/lands?limit=8");
                if (response.ok) {
                    const data = await response.json();
                    setFeaturedLands(data.slice(0, 8));
                }
            } catch (error) {
                console.error("Failed to fetch lands:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedLands();
    }, []);

    return (
        <div className="min-h-screen bg-sand">
            {/* Hero Section with Parallax */}
            <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Image with Parallax */}
                <motion.div
                    className="absolute inset-0 z-0"
                    style={{ scale: heroScale }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90" />
                </motion.div>

                {/* Content */}
                <motion.div
                    className="relative z-10 w-full px-4 py-20"
                    style={{ opacity: heroOpacity }}
                >
                    <div className="max-w-4xl mx-auto text-center mb-10">
                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            أول منصة جزائرية للأراضي الزراعية
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            بيع، كراء واستثمار الأراضي الفلاحية بشفافية وأمان تام
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                            <Link href="/dashboard/seller/add">
                                <Button
                                    size="lg"
                                    className="rounded-2xl px-8 py-6 text-lg gap-2 bg-accent hover:bg-accent-dark text-accent-foreground font-bold shadow-xl hover:shadow-2xl transition-all"
                                >
                                    <Plus className="h-5 w-5" />
                                    اعرض أرضك مجاناً
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Search Widget */}
                    <SearchWidget />
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
                        <div className="w-1.5 h-3 bg-white/50 rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Platform Introduction */}
            <section className="py-16 md:py-20 px-4 bg-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        className="glass rounded-3xl p-8 md:p-12 text-center"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                            منصة <span className="text-primary">موثوقة</span> لجميع أنواع الأراضي
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            تعمل المنصة على خلق فضاء موثوق يسهل الوصول إلى الأراضي الزراعية بمختلف أنواعها
                            سواء كانت تابعة للدولة، للخواص أو أوقاف. كما تجمع بين أصحاب الأراضي والمستثمرين
                            بطريقة شفافة ومنظمة.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Land Categories */}
            <section className="py-16 md:py-20 px-4 bg-sand">
                <div className="max-w-5xl mx-auto">
                    <motion.h2
                        className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        أنواع الأراضي
                    </motion.h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {landCategories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <motion.div
                                    key={category.type}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Link href={`/browse/${category.type}`}>
                                        <div className="h-52 md:h-60 rounded-3xl overflow-hidden cursor-pointer group relative">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`} />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                                            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6 text-white">
                                                <motion.div
                                                    className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4"
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <Icon className="h-8 w-8 text-white" />
                                                </motion.div>
                                                <h3 className="text-xl md:text-2xl font-bold mb-1">
                                                    {category.title}
                                                </h3>
                                                <p className="text-white/80 text-sm">
                                                    {category.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Trust Section (BentoGrid) */}
            <BentoGrid />

            {/* Featured Lands */}
            <section className="py-16 md:py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="flex justify-between items-center mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                أحدث الأراضي المضافة
                            </h2>
                            <p className="text-gray-600">اكتشف أفضل الفرص الاستثمارية</p>
                        </div>
                        <Link href="/search">
                            <Button variant="ghost" className="gap-2 text-primary hover:text-primary-dark hover:bg-primary/5">
                                عرض الكل
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>

                    {loading ? (
                        <div className="carousel-scroll pb-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-[280px] md:w-[320px] flex-shrink-0">
                                    <LandCardSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : featuredLands.length > 0 ? (
                        <div className="carousel-scroll pb-4">
                            {featuredLands.map((land, index) => (
                                <motion.div
                                    key={land.id}
                                    className="w-[280px] md:w-[320px] flex-shrink-0"
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <LandCard {...land} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">🌾</span>
                            </div>
                            <p className="text-gray-500">لا توجد أراضي بعد</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-primary via-primary to-primary-dark relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

                <motion.div
                    className="max-w-3xl mx-auto text-center relative z-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                        هل لديك أرض للبيع أو للكراء؟
                    </h2>
                    <p className="text-xl text-white/80 mb-10">
                        انضم لمئات المعلنين واعرض أرضك اليوم مجاناً
                    </p>
                    <Link href="/auth/register">
                        <Button
                            size="lg"
                            className="rounded-2xl px-10 py-7 text-lg bg-accent hover:bg-accent-dark text-accent-foreground font-bold shadow-2xl hover:shadow-3xl transition-all"
                        >
                            ابدأ الآن مجاناً
                        </Button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
