"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Building2, Landmark, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

type TabType = "buy" | "rent" | "invest";

const tabs = [
    { id: "buy" as TabType, label: "شراء", icon: Building2 },
    { id: "rent" as TabType, label: "كراء", icon: Users },
    { id: "invest" as TabType, label: "استثمار", icon: Landmark },
];

const landTypes = [
    { value: "", label: "جميع الأنواع" },
    { value: "concession", label: "أراضي الدولة" },
    { value: "private", label: "أراضي الخواص" },
    { value: "waqf", label: "أراضي وقفية" },
];

const wilayas = [
    { value: "", label: "اختر الولاية" },
    { value: "الجزائر", label: "الجزائر" },
    { value: "وهران", label: "وهران" },
    { value: "قسنطينة", label: "قسنطينة" },
    { value: "البليدة", label: "البليدة" },
    { value: "سطيف", label: "سطيف" },
    { value: "باتنة", label: "باتنة" },
    { value: "بجاية", label: "بجاية" },
    { value: "تلمسان", label: "تلمسان" },
    { value: "تيزي وزو", label: "تيزي وزو" },
    { value: "عنابة", label: "عنابة" },
];

export default function SearchWidget() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("buy");
    const [wilaya, setWilaya] = useState("");
    const [landType, setLandType] = useState("");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (wilaya) params.append("wilaya", wilaya);
        if (landType) params.append("type", landType);

        const serviceType = activeTab === "rent" ? "rent" : "sale";
        params.append("service_type", serviceType);

        router.push(`/search?${params.toString()}`);
    };

    return (
        <motion.div
            className="glass rounded-3xl p-6 md:p-8 shadow-glass max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            {/* Tabs */}
            <div className="flex justify-center mb-6">
                <div className="inline-flex bg-gray-100 rounded-2xl p-1.5">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2
                                    ${activeTab === tab.id
                                        ? "text-white"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        className="absolute inset-0 bg-primary rounded-xl"
                                        layoutId="activeTab"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search Form */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    {/* Wilaya Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            الولاية
                        </label>
                        <div className="relative">
                            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
                            <select
                                value={wilaya}
                                onChange={(e) => setWilaya(e.target.value)}
                                className="w-full pr-12 pl-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 appearance-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                                {wilayas.map((w) => (
                                    <option key={w.value} value={w.value}>
                                        {w.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Land Type Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            نوع الأرض
                        </label>
                        <div className="relative">
                            <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
                            <select
                                value={landType}
                                onChange={(e) => setLandType(e.target.value)}
                                className="w-full pr-12 pl-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 appearance-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                                {landTypes.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                        <Button
                            onClick={handleSearch}
                            className="w-full h-[54px] rounded-xl bg-accent hover:bg-accent-dark text-accent-foreground font-bold text-base gap-2 shadow-lg hover:shadow-xl transition-all"
                        >
                            <Search className="h-5 w-5" />
                            ابحث الآن
                        </Button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}
