'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Assuming you have a utils file for classNames, otherwise remove this import

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'new_match' | 'message' | 'land_verified' | 'land_rejected' | 'consultation_response';
    is_read: boolean;
    created_at: string;
    related_land_id?: number;
}

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            // Only fetch if we're in the browser and have a token
            if (typeof window === 'undefined') return;

            const token = localStorage.getItem('token');
            if (!token) return;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch('http://localhost:5000/api/notifications?limit=5', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            // Silently handle network errors to avoid console spam
            // This is expected when backend is not running
            if (error instanceof Error && error.name !== 'AbortError') {
                // Only log in development if needed for debugging
                // console.debug('Notifications fetch skipped:', error.message);
            }
        }
    };

    // Initial fetch and poller
    useEffect(() => {
        fetchNotifications();
        // Poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
            setUnreadCount(Math.max(0, unreadCount - 1));
        } catch (error) {
            console.error('Failed to mark read:', error);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
        }
        setIsOpen(false);

        // Navigation logic
        if (notification.related_land_id) {
            router.push(`/lands/${notification.related_land_id}`);
        } else if (notification.type === 'message') {
            router.push('/dashboard/seller/messages'); // Or appropriate messages route
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="h-6 w-6 text-white" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white border-2 border-green-600">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl overflow-hidden z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                    <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">الإشعارات</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={async () => {
                                    // Mark all logic here if needed
                                }}
                                className="text-xs text-green-600 hover:text-green-700 font-medium"
                            >
                                تحديد الكل كمقروء
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative ${!notification.is_read ? 'bg-green-50/50' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notification.is_read ? 'bg-green-500' : 'bg-transparent'
                                                }`} />
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm mb-1">{notification.title}</p>
                                                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <span className="text-xs text-gray-400 mt-2 block">
                                                    {new Date(notification.created_at).toLocaleDateString('ar-DZ', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p>لا توجد إشعارات حالياً</p>
                            </div>
                        )}
                    </div>

                    <div className="p-2 border-t bg-gray-50 text-center">
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                            عرض كل الإشعارات
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
