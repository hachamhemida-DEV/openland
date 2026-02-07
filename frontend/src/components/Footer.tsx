"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

const footerLinks = {
    browse: [
        { label: "أراضي الدولة", href: "/browse/concession" },
        { label: "أراضي الخواص", href: "/browse/private" },
        { label: "أراضي وقفية", href: "/browse/waqf" },
        { label: "البحث المتقدم", href: "/search" },
    ],
    company: [
        { label: "من نحن", href: "/about" },
        { label: "كيف يعمل", href: "/how-it-works" },
        { label: "الأسئلة الشائعة", href: "/faq" },
        { label: "اتصل بنا", href: "/contact" },
    ],
    legal: [
        { label: "سياسة الخصوصية", href: "/privacy" },
        { label: "شروط الاستخدام", href: "/terms" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-primary text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-lg">
                                <img
                                    src="/logo.jpg"
                                    alt="أوبن لاند"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="font-bold text-xl">أوبن لاند</span>
                        </Link>
                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                            أول منصة رقمية جزائرية للأراضي الزراعية. بيع، كراء واستثمار بشفافية وأمان.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm">
                            <a href="tel:+213542557621" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                                <Phone className="h-4 w-4" />
                                <span dir="ltr">+213 542 557 621</span>
                            </a>
                            <a href="mailto:contact@openland.dz" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                                <Mail className="h-4 w-4" />
                                contact@openland.dz
                            </a>
                            <p className="flex items-center gap-2 text-white/70">
                                <MapPin className="h-4 w-4" />
                                خنشلة، خنشلة
                            </p>
                        </div>
                    </div>

                    {/* Browse Links */}
                    <div>
                        <h4 className="font-bold mb-4">تصفح</h4>
                        <ul className="space-y-2">
                            {footerLinks.browse.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/70 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-bold mb-4">الشركة</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/70 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal & Social */}
                    <div>
                        <h4 className="font-bold mb-4">قانوني</h4>
                        <ul className="space-y-2 mb-6">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/70 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Social Links */}
                        <h4 className="font-bold mb-3">تابعنا</h4>
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, href: "#", label: "Facebook" },
                                { icon: Instagram, href: "#", label: "Instagram" },
                                { icon: Twitter, href: "#", label: "Twitter" },
                            ].map((social) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={social.label}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
                        <p>© {new Date().getFullYear()} أوبن لاند. جميع الحقوق محفوظة.</p>
                        <p>صُنع بـ ❤️ في الجزائر 🇩🇿</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
