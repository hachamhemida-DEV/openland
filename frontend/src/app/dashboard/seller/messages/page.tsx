'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Message {
    id: number;
    sender: { full_name: string; email: string };
    receiver: { full_name: string; email: string };
    content: string;
    created_at: string;
    is_read: boolean;
}

interface Conversation {
    partner: { id: number; full_name: string; email: string };
    lastMessage: Message;
    unreadCount: number;
}

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/messages', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (partnerId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/messages/${partnerId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConv) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    receiver_id: selectedConv.partner.id,
                    content: newMessage,
                }),
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages(selectedConv.partner.id);
                fetchConversations();
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (loading) {
        return <p className="text-center py-12">جاري التحميل...</p>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">الرسائل</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Conversations List */}
                <Card className="md:col-span-1">
                    <CardContent className="p-4">
                        <h2 className="font-bold mb-4">المحادثات</h2>
                        {conversations.length > 0 ? (
                            <div className="space-y-2">
                                {conversations.map((conv) => (
                                    <div
                                        key={conv.partner.id}
                                        className={`p-3 rounded cursor-pointer hover:bg-gray-50 ${selectedConv?.partner.id === conv.partner.id ? 'bg-gray-100' : ''
                                            }`}
                                        onClick={() => {
                                            setSelectedConv(conv);
                                            fetchMessages(conv.partner.id);
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{conv.partner.full_name}</p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {conv.lastMessage.content}
                                                </p>
                                            </div>
                                            {conv.unreadCount > 0 && (
                                                <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-8">لا توجد رسائل</p>
                        )}
                    </CardContent>
                </Card>

                {/* Messages */}
                <Card className="md:col-span-2">
                    <CardContent className="p-4">
                        {selectedConv ? (
                            <div className="flex flex-col h-96">
                                <div className="border-b pb-3 mb-4">
                                    <h2 className="font-bold">{selectedConv.partner.full_name}</h2>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                    {messages.map((msg) => {
                                        const userStr = localStorage.getItem('user');
                                        const currentUser = userStr ? JSON.parse(userStr) : null;
                                        const isMe = msg.sender.email === currentUser?.email;

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}
                                            >
                                                <div
                                                    className={`max-w-xs px-4 py-2 rounded-lg ${isMe
                                                            ? 'bg-gray-100 text-gray-900'
                                                            : 'bg-green-600 text-white'
                                                        }`}
                                                >
                                                    <p>{msg.content}</p>
                                                    <p className="text-xs mt-1 opacity-70">
                                                        {new Date(msg.created_at).toLocaleTimeString('ar-DZ')}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="اكتب رسالة..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                    <Button onClick={sendMessage}>إرسال</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-96 flex items-center justify-center text-gray-500">
                                اختر محادثة لبدء المراسلة
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
