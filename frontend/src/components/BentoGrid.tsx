"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { MapPin, Users, Shield, TrendingUp } from "lucide-react";

interface StatItem {
    icon: React.ElementType;
    value: number;
    suffix: string;
    label: string;
    color: string;
}

const stats: StatItem[] = [
    {
        icon: MapPin,
        value: 500,
        suffix: "+",
        label: "هكتار مدرج",
        color: "from-primary to-primary-dark",
    },
    {
        icon: Users,
        value: 1200,
        suffix: "+",
        label: "مستخدم مسجل",
        color: "from-accent to-accent-dark",
    },
    {
        icon: Shield,
        value: 100,
        suffix: "%",
        label: "ملاك موثقين",
        color: "from-emerald-500 to-emerald-700",
    },
    {
        icon: TrendingUp,
        value: 48,
        suffix: "",
        label: "ولاية مغطاة",
        color: "from-blue-500 to-blue-700",
    },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [isInView, value]);

    return (
        <span ref={ref} className="tabular-nums">
            {count.toLocaleString()}{suffix}
        </span>
    );
}

export default function BentoGrid() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    return (
        <section className="py-16 md:py-24 px-4 bg-sand">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        لماذا <span className="text-primary">أوبن لاند</span>؟
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        منصة موثوقة تجمع بين أصحاب الأراضي والمستثمرين بشفافية تامة
                    </p>
                </motion.div>

                <div className="bento-grid">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`
                                    bg-white rounded-2xl p-6 md:p-8 shadow-land-card
                                    hover:shadow-land-card-hover transition-all duration-300
                                    flex flex-col items-center justify-center text-center
                                    ${index === 0 ? "md:row-span-2 md:py-12" : ""}
                                `}
                            >
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <Icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                                </div>
                                <div className={`text-3xl md:text-4xl ${index === 0 ? "md:text-5xl" : ""} font-bold text-gray-900 mb-2`}>
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-gray-600 font-medium">{stat.label}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
