"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import MapView from "@/components/maps/MapView";
import {
    MapPin, Tag, Ruler, Calendar, Building2, User, Phone,
    Mail, CheckCircle, Clock, XCircle, MessageCircle, Droplets,
    Zap, Route, ChevronDown, ChevronUp, X, ArrowLeft, Share2, Heart
} from "lucide-react";
import Link from "next/link";

interface Land {
    id: number;
    title: string;
    price: number;
    area_m2: number;
    wilaya: string;
    baladia: string;
    type: string;
    service_type: string;
    description: string;
    status: string;
    rejection_reason?: string;
    owner_id: number;
    owner?: { full_name: string; phone: string; email: string };
    media: { id: number; url: string; media_type: string }[];
    geom?: { coordinates: [number, number] };
    created_at: string;
}

const landTypes: Record<string, string> = {
    private: "أرض خاصة (أفراد)",
    waqf: "أرض وقفية",
    concession: "أرض دولة (امتياز)",
};

const serviceTypes: Record<string, string> = {
    sale: "للبيع",
    rent: "للكراء",
};

const landStatus: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
    verified: { label: "تمت الموافقة", color: "text-green-700", bgColor: "bg-green-50 border-green-200", icon: CheckCircle },
    pending: { label: "قيد المراجعة", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200", icon: Clock },
    rejected: { label: "مرفوض", color: "text-red-700", bgColor: "bg-red-50 border-red-200", icon: XCircle },
};

export default function LandDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [land, setLand] = useState<Land | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showLegalDetails, setShowLegalDetails] = useState(false);
    const [officeSettings, setOfficeSettings] = useState({
        office_phone: "+213555123456",
        office_whatsapp: "213555123456",
    });

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUser(user);
            setIsAdmin(user.role === "admin");
        }

        fetch("http://localhost:5000/api/settings")
            .then((res) => res.json())
            .then((data) => {
                if (data.office_phone || data.office_whatsapp) {
                    setOfficeSettings(data);
                }
            })
            .catch((err) => console.error("Failed to fetch settings:", err));
    }, []);

    useEffect(() => {
        const fetchLandDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                let url = `http://localhost:5000/api/lands/${id}`;
                const headers: any = {};

                if (isAdmin && token) {
                    url = `http://localhost:5000/api/lands/admin/${id}`;
                    headers["Authorization"] = `Bearer ${token}`;
                }

                const response = await fetch(url, { headers });
                if (!response.ok) {
                    throw new Error("Failed to fetch land details");
                }
                const data = await response.json();
                setLand(data);

                if (currentUser && data.owner_id === currentUser.id) {
                    setIsOwner(true);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLandDetails();
    }, [id, currentUser, isAdmin]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-sand">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-gray-500">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (error || !land) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-sand">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">العقار غير موجود</h2>
                <p className="text-gray-500 mb-6">{error || "لم نتمكن من العثور على هذا العقار"}</p>
                <Link href="/search">
                    <Button className="rounded-xl">العودة للبحث</Button>
                </Link>
            </div>
        );
    }

    const statusInfo = landStatus[land.status] || landStatus.pending;
    const StatusIcon = statusInfo.icon;
    const images = land.media?.filter((m) => m.media_type === "image") || [];
    const mainImage = images[0];
    const gridImages = images.slice(1, 5);

    return (
        <div className="min-h-screen bg-sand">
            {/* Image Gallery Grid */}
            <section className="relative">
                <div className="grid grid-cols-4 gap-2 h-[50vh] md:h-[60vh]">
                    {/* Main Image */}
                    <div
                        className="col-span-4 md:col-span-2 md:row-span-2 relative cursor-pointer group overflow-hidden"
                        onClick={() => mainImage && setSelectedImage(`http://localhost:5000${mainImage.url}`)}
                    >
                        {mainImage ? (
                            <img
                                src={`http://localhost:5000${mainImage.url}`}
                                alt={land.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                <span className="text-6xl">🌾</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    {/* Grid Images */}
                    {gridImages.map((image, index) => (
                        <div
                            key={image.id}
                            className="hidden md:block relative cursor-pointer group overflow-hidden"
                            onClick={() => setSelectedImage(`http://localhost:5000${image.url}`)}
                        >
                            <img
                                src={`http://localhost:5000${image.url}`}
                                alt={`صورة ${index + 2}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                    ))}

                    {/* Placeholder cells if less than 4 additional images */}
                    {Array.from({ length: Math.max(0, 4 - gridImages.length) }).map((_, i) => (
                        <div
                            key={`placeholder-${i}`}
                            className="hidden md:flex bg-gray-100 items-center justify-center"
                        >
                            <span className="text-2xl text-gray-300">🌾</span>
                        </div>
                    ))}
                </div>

                {/* Back Button */}
                <Link href="/search">
                    <motion.button
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </motion.button>
                </Link>

                {/* Action Buttons */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <motion.button
                        className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Heart className="h-5 w-5 text-gray-700" />
                    </motion.button>
                    <motion.button
                        className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Share2 className="h-5 w-5 text-gray-700" />
                    </motion.button>
                </div>

                {/* Image Count Badge */}
                {images.length > 5 && (
                    <button
                        className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg font-medium text-sm"
                        onClick={() => mainImage && setSelectedImage(`http://localhost:5000${mainImage.url}`)}
                    >
                        +{images.length - 5} صور أخرى
                    </button>
                )}
            </section>

            {/* Content Section */}
            <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Right side in RTL */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title & Location */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-accent/20 text-accent-dark text-sm px-4 py-1.5 rounded-full font-bold">
                                    {serviceTypes[land.service_type] || "للبيع"}
                                </span>
                                <span className="bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full font-medium">
                                    {landTypes[land.type] || land.type}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                {land.title}
                            </h1>
                            <p className="text-gray-500 flex items-center text-lg">
                                <MapPin className="h-5 w-5 ml-2 text-primary" />
                                {land.wilaya}، {land.baladia}
                            </p>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {[
                                { icon: Ruler, label: "المساحة", value: `${land.area_m2?.toLocaleString()} م²` },
                                { icon: Tag, label: "السعر/م²", value: `${Math.round(land.price / land.area_m2).toLocaleString()} دج` },
                                { icon: Calendar, label: "تاريخ النشر", value: new Date(land.created_at).toLocaleDateString("ar-DZ") },
                                { icon: Building2, label: "النوع", value: landTypes[land.type]?.split(" ")[0] || land.type },
                            ].map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className="bg-white rounded-2xl p-4 text-center shadow-sm">
                                        <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                                        <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                                        <p className="font-bold text-gray-900 text-sm">{stat.value}</p>
                                    </div>
                                );
                            })}
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            className="bg-white rounded-2xl p-6 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-xl font-bold mb-4 text-gray-900">الوصف</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {land.description}
                            </p>
                        </motion.div>

                        {/* Legal Status Accordion */}
                        <motion.div
                            className="bg-white rounded-2xl shadow-sm overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <button
                                className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                onClick={() => setShowLegalDetails(!showLegalDetails)}
                            >
                                <h2 className="text-xl font-bold text-gray-900">الحالة القانونية</h2>
                                {showLegalDetails ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                            <AnimatePresence>
                                {showLegalDetails && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-t"
                                    >
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <Building2 className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">نوع الملكية</p>
                                                    <p className="font-bold">{landTypes[land.type]}</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                يرجى التحقق من الوثائق القانونية مع الإدارة قبل إتمام أي معاملة.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Infrastructure */}
                        <motion.div
                            className="bg-white rounded-2xl p-6 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <h2 className="text-xl font-bold mb-4 text-gray-900">البنية التحتية</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { icon: Droplets, label: "مياه", available: true },
                                    { icon: Zap, label: "كهرباء", available: true },
                                    { icon: Route, label: "طريق معبد", available: true },
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-xl text-center ${item.available ? "bg-green-50" : "bg-gray-50"
                                                }`}
                                        >
                                            <Icon className={`h-6 w-6 mx-auto mb-2 ${item.available ? "text-green-600" : "text-gray-400"
                                                }`} />
                                            <p className={`text-sm font-medium ${item.available ? "text-green-700" : "text-gray-500"
                                                }`}>
                                                {item.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Map */}
                        <motion.div
                            className="bg-white rounded-2xl p-6 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <h2 className="text-xl font-bold mb-4 text-gray-900">الموقع على الخريطة</h2>
                            <div className="h-[300px] md:h-[400px] rounded-xl overflow-hidden">
                                {land.geom?.coordinates ? (
                                    <MapView
                                        lat={land.geom.coordinates[1]}
                                        lng={land.geom.coordinates[0]}
                                    />
                                ) : (
                                    <div className="h-full bg-gray-100 flex items-center justify-center text-gray-500">
                                        الموقع غير محدد
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar - Left side in RTL */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <motion.div
                            className="bg-white rounded-2xl p-6 shadow-lg sticky top-24"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <p className="text-sm text-gray-500 mb-1">السعر الإجمالي</p>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                {land.price?.toLocaleString()} <span className="text-lg font-normal">دج</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">
                                {land.service_type === "rent" ? "للكراء السنوي" : "للبيع"}
                            </p>

                            {/* Status for Owner */}
                            {isOwner && (
                                <div className={`border rounded-xl p-4 mb-4 ${statusInfo.bgColor}`}>
                                    <div className="flex items-center gap-3">
                                        <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
                                        <div>
                                            <p className={`font-bold ${statusInfo.color}`}>حالة الإعلان</p>
                                            <p className={`text-sm ${statusInfo.color}`}>{statusInfo.label}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Admin - Seller Info */}
                            {isAdmin && land.owner && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        معلومات المعلن
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-blue-600" />
                                            <span className="font-medium">{land.owner.full_name || "غير محدد"}</span>
                                        </p>
                                        {land.owner.phone && (
                                            <p className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-blue-600" />
                                                <span dir="ltr">{land.owner.phone}</span>
                                            </p>
                                        )}
                                        <p className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-blue-600" />
                                            <span className="text-xs">{land.owner.email}</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Regular User - Contact Info */}
                            {!isOwner && !isAdmin && (
                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">OpenLand</p>
                                            <p className="text-sm text-gray-600">وسيط معتمد</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        للتواصل والاستفسار عن هذا العقار، يرجى الاتصال بنا
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {!isOwner && !isAdmin && (
                                <div className="space-y-3">
                                    <a href={`tel:${officeSettings.office_phone}`}>
                                        <Button className="w-full rounded-xl h-12 bg-primary hover:bg-primary-dark gap-2">
                                            <Phone className="h-5 w-5" />
                                            اتصل الآن
                                        </Button>
                                    </a>
                                    <a href={`https://wa.me/${officeSettings.office_whatsapp}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="w-full rounded-xl h-12 border-green-500 text-green-600 hover:bg-green-50 gap-2 mt-3">
                                            <MessageCircle className="h-5 w-5" />
                                            واتساب
                                        </Button>
                                    </a>
                                </div>
                            )}

                            {isOwner && (
                                <Link href={`/dashboard/seller/edit/${land.id}`}>
                                    <Button className="w-full rounded-xl h-12">
                                        تعديل الإعلان
                                    </Button>
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mobile Sticky CTA */}
            {!isOwner && !isAdmin && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 lg:hidden z-40 shadow-lg">
                    <div className="flex gap-3">
                        <a href={`tel:${officeSettings.office_phone}`} className="flex-1">
                            <Button className="w-full rounded-xl h-12 bg-primary hover:bg-primary-dark gap-2">
                                <Phone className="h-5 w-5" />
                                اتصل الآن
                            </Button>
                        </a>
                        <a href={`https://wa.me/${officeSettings.office_whatsapp}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="rounded-xl h-12 px-4 border-green-500 text-green-600">
                                <MessageCircle className="h-5 w-5" />
                            </Button>
                        </a>
                    </div>
                </div>
            )}

            {/* Image Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="h-8 w-8" />
                        </button>
                        <motion.img
                            src={selectedImage}
                            alt="صورة مكبرة"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
