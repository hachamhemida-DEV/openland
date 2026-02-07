"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, List, Plus, MessageSquare, LogOut, Heart,
    Settings, Menu, X, ChevronLeft, User
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
    { href: "/dashboard/seller", icon: LayoutDashboard, label: "لوحة التحكم" },
    { href: "/dashboard/seller/lands", icon: List, label: "عقاراتي" },
    { href: "/dashboard/seller/add", icon: Plus, label: "إضافة عقار" },
    { href: "/dashboard/seller/favorites", icon: Heart, label: "المفضلة" },
    { href: "/dashboard/seller/messages", icon: MessageSquare, label: "الرسائل" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserName(user.full_name || "مستخدم");
            setUserEmail(user.email || "");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-sand">
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b md:hidden z-40 px-4 flex items-center justify-between">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Menu className="h-6 w-6 text-gray-700" />
                </button>
                <Link href="/" className="font-bold text-primary text-lg">
                    أوبن لاند
                </Link>
                <div className="w-10" />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 md:hidden"
                        onClick={closeSidebar}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:sticky top-0 right-0 h-screen w-72 bg-white border-l border-gray-100 
                    transform transition-transform duration-300 z-50
                    ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 shadow-sm">
                                    <img
                                        src="/logo.jpg"
                                        alt="أوبن لاند"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="font-bold text-xl text-primary">أوبن لاند</span>
                            </Link>
                            <button
                                onClick={closeSidebar}
                                className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 truncate">{userName}</p>
                                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeSidebar}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                        ${isActive
                                            ? "bg-primary text-white shadow-lg"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            className="mr-auto"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </motion.div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-100 space-y-2">
                        <Link href="/dashboard/seller/settings" onClick={closeSidebar}>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                            >
                                <Settings className="h-5 w-5" />
                                الإعدادات
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                        >
                            <LogOut className="h-5 w-5" />
                            تسجيل الخروج
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-h-screen pt-16 md:pt-0">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
