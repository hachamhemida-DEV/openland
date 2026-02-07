"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, Search, ChevronDown, Building2, Users, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import NotificationDropdown from "@/components/NotificationDropdown";

const landCategories = [
    { href: "/browse/concession", icon: Building2, label: "أراضي الدولة", desc: "عقود امتياز" },
    { href: "/browse/private", icon: Users, label: "أراضي الخواص", desc: "الأفراد" },
    { href: "/browse/waqf", icon: Landmark, label: "أراضي وقفية", desc: "أوقاف" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            setUser(JSON.parse(userStr));
        } else {
            setUser(null);
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        router.push("/");
    };

    const getDashboardLink = () => {
        if (!user) return "/";
        if (user.role === "admin") return "/admin";
        if (user.role === "seller") return "/dashboard/seller";
        return "/dashboard/buyer";
    };

    const isHomePage = pathname === "/";

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHomePage
                    ? "glass-navbar border-b border-gray-100"
                    : "bg-transparent"
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 md:h-18">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
                                <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden bg-white shadow-lg ring-2 ring-white/20 group-hover:ring-accent/50 transition-all">
                                    <img
                                        src="/logo.jpg"
                                        alt="أوبن لاند"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className={`font-bold text-lg hidden sm:block transition-colors ${scrolled || !isHomePage ? "text-primary" : "text-primary drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]"
                                    }`}>
                                    أوبن لاند
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:gap-1">
                            <Link
                                href="/"
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${scrolled || !isHomePage
                                    ? "text-gray-700 hover:text-primary hover:bg-primary/5"
                                    : "text-primary bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white"
                                    }`}
                            >
                                الرئيسية
                            </Link>

                            {/* Mega Menu Trigger */}
                            <div
                                className="relative"
                                onMouseEnter={() => setShowMegaMenu(true)}
                                onMouseLeave={() => setShowMegaMenu(false)}
                            >
                                <button
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${scrolled || !isHomePage
                                        ? "text-gray-700 hover:text-primary hover:bg-primary/5"
                                        : "text-primary bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white"
                                        }`}
                                >
                                    تصفح الأراضي
                                    <ChevronDown className={`h-4 w-4 transition-transform ${showMegaMenu ? "rotate-180" : ""}`} />
                                </button>

                                {/* Mega Menu Dropdown */}
                                <AnimatePresence>
                                    {showMegaMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                                        >
                                            <div className="p-2">
                                                {landCategories.map((category) => {
                                                    const Icon = category.icon;
                                                    return (
                                                        <Link
                                                            key={category.href}
                                                            href={category.href}
                                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
                                                        >
                                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                                <Icon className="h-5 w-5 text-primary group-hover:text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900">{category.label}</p>
                                                                <p className="text-xs text-gray-500">{category.desc}</p>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                            <div className="border-t p-3 bg-gray-50">
                                                <Link
                                                    href="/search"
                                                    className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary-dark"
                                                >
                                                    <Search className="h-4 w-4" />
                                                    بحث متقدم
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link
                                href="/search"
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${scrolled || !isHomePage
                                    ? "text-gray-700 hover:text-primary hover:bg-primary/5"
                                    : "text-primary bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white"
                                    }`}
                            >
                                <Search className="h-4 w-4" />
                                البحث
                            </Link>
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex md:items-center gap-2">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <NotificationDropdown />
                                    <span className="text-sm text-gray-900 font-medium bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                        {user.full_name || user.email}
                                    </span>
                                    <Link href={getDashboardLink()}>
                                        <Button
                                            size="sm"
                                            className="rounded-xl gap-1.5 bg-primary hover:bg-primary-dark text-white shadow-lg"
                                        >
                                            <User className="h-4 w-4" />
                                            لوحة التحكم
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="rounded-xl gap-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 bg-white/80 backdrop-blur-sm"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        خروج
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Link href="/auth/login">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`rounded-xl ${scrolled || !isHomePage
                                                ? "text-gray-700 hover:text-primary hover:bg-primary/5"
                                                : "text-white hover:text-white hover:bg-white/10"
                                                }`}
                                        >
                                            تسجيل الدخول
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button
                                            size="sm"
                                            className="rounded-xl bg-accent hover:bg-accent-dark text-accent-foreground font-bold shadow-lg"
                                        >
                                            حساب جديد
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`inline-flex items-center justify-center p-2 rounded-xl focus:outline-none transition-colors ${scrolled || !isHomePage
                                    ? "text-gray-700 hover:bg-gray-100"
                                    : "text-white hover:bg-white/10"
                                    }`}
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-white border-t border-gray-100 shadow-xl"
                        >
                            <div className="py-3 space-y-1 px-4">
                                <Link
                                    href="/"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                                >
                                    الرئيسية
                                </Link>
                                <Link
                                    href="/search"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                                >
                                    البحث عن أرض
                                </Link>

                                {/* Land Categories */}
                                <div className="pt-2 pb-1 px-4">
                                    <p className="text-xs text-gray-400 font-medium mb-2">تصفح حسب النوع</p>
                                </div>
                                {landCategories.map((category) => {
                                    const Icon = category.icon;
                                    return (
                                        <Link
                                            key={category.href}
                                            href={category.href}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                                        >
                                            <Icon className="h-5 w-5 text-primary" />
                                            <div>
                                                <span className="font-medium">{category.label}</span>
                                                <span className="text-xs text-gray-400 mr-2">({category.desc})</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-100 py-4 px-4 space-y-3">
                                {user ? (
                                    <>
                                        <div className="text-sm text-gray-500 mb-3 px-4">
                                            مرحباً، {user.full_name || user.email}
                                        </div>
                                        <Link href={getDashboardLink()} onClick={() => setIsOpen(false)} className="block">
                                            <Button className="w-full rounded-xl gap-2 bg-primary hover:bg-primary-dark">
                                                <User className="h-4 w-4" />
                                                لوحة التحكم
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl gap-2"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            تسجيل الخروج
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/auth/login" onClick={() => setIsOpen(false)} className="block">
                                            <Button variant="outline" className="w-full rounded-xl border-gray-300">
                                                تسجيل الدخول
                                            </Button>
                                        </Link>
                                        <Link href="/auth/register" onClick={() => setIsOpen(false)} className="block">
                                            <Button className="w-full rounded-xl bg-accent hover:bg-accent-dark text-accent-foreground font-bold">
                                                حساب جديد
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Spacer for fixed navbar */}
            <div className="h-16 md:h-18" />
        </>
    );
}
