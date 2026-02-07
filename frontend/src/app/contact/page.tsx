"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactInfo = [
    {
        icon: Phone,
        title: "الهاتف",
        value: "+213 542 557 621",
        link: "tel:+213542557621",
        color: "bg-primary"
    },
    {
        icon: MessageCircle,
        title: "واتساب",
        value: "+213 542 557 621",
        link: "https://wa.me/213542557621",
        color: "bg-green-500"
    },
    {
        icon: Mail,
        title: "البريد الإلكتروني",
        value: "contact@openland.dz",
        link: "mailto:contact@openland.dz",
        color: "bg-blue-500"
    },
    {
        icon: MapPin,
        title: "العنوان",
        value: "خنشلة، خنشلة",
        link: null,
        color: "bg-accent"
    }
];

export default function ContactPage() {
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
                        اتصل بنا
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl text-white/80"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        نحن هنا للإجابة على استفساراتك ومساعدتك
                    </motion.p>
                </div>
            </section>

            {/* Contact Info */}
            <section className="py-16 md:py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon;
                            const content = (
                                <motion.div
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center`}>
                                            <Icon className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">{info.title}</p>
                                            <p className="font-bold text-gray-900" dir={info.title === "البريد الإلكتروني" ? "ltr" : "rtl"}>
                                                {info.value}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );

                            return info.link ? (
                                <a key={info.title} href={info.link} target={info.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                                    {content}
                                </a>
                            ) : (
                                <div key={info.title}>{content}</div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Working Hours */}
            <section className="py-12 px-4 bg-white">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium">أوقات العمل</span>
                    </div>
                    <p className="text-gray-600">
                        الأحد - الخميس: 8:00 صباحاً - 5:00 مساءً
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        (نستقبل الرسائل على الواتساب 24/7)
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 px-4">
                <motion.div
                    className="max-w-2xl mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 md:p-12 text-center text-white"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        تواصل معنا الآن
                    </h2>
                    <p className="text-white/80 mb-8">
                        فريقنا جاهز لمساعدتك في العثور على الأرض المناسبة أو عرض أرضك للبيع
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:+213542557621">
                            <Button size="lg" className="rounded-xl bg-white text-primary hover:bg-gray-100 gap-2 w-full sm:w-auto">
                                <Phone className="h-5 w-5" />
                                اتصل الآن
                            </Button>
                        </a>
                        <a href="https://wa.me/213542557621" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="rounded-xl bg-green-500 hover:bg-green-600 text-white gap-2 w-full sm:w-auto">
                                <MessageCircle className="h-5 w-5" />
                                واتساب
                            </Button>
                        </a>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
