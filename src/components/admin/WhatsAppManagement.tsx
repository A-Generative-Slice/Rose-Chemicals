'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Search,
    MessageSquare,
    RefreshCw,
    User,
    Clock,
    ChevronLeft,
    MoreVertical,
    CheckCheck
} from 'lucide-react';
import { adminAPI } from '../../services/api';

interface Conversation {
    phoneNumber: string;
    lastMessage: string;
    lastTimestamp: string;
    type: 'received' | 'sent';
}

interface Message {
    _id: string;
    phoneNumber: string;
    message: string;
    type: 'received' | 'sent';
    timestamp: string;
}

export default function WhatsAppManagement() {
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedPhone) {
            fetchChatHistory(selectedPhone);
        }
    }, [selectedPhone]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getWhatsAppConversations();
            console.log('WhatsApp Conversations API Response:', data);
            if (data.success) {
                setConversations(data.data);
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchChatHistory = async (phone: string) => {
        try {
            setChatLoading(true);
            const data = await adminAPI.getWhatsAppChatHistory(phone);
            console.log(`WhatsApp Chat History API Response for ${phone}:`, data);
            if (data.success) {
                setMessages(data.data);
            }
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setChatLoading(false);
        }
    };

    const formatTime = (dateStr: string | number) => {
        if (!dateStr) return '';

        try {
            // Handle Unix timestamps (in seconds)
            let date: Date;
            if (typeof dateStr === 'number') {
                date = new Date(dateStr * 1000);
            } else if (!isNaN(Number(dateStr))) {
                date = new Date(Number(dateStr) * 1000);
            } else {
                date = new Date(dateStr);
            }

            if (isNaN(date.getTime())) {
                return '';
            }

            return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        } catch (err) {
            return '';
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.phoneNumber.includes(searchTerm) || conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm h-[calc(100vh-140px)] flex">
            {/* Sidebar - Conversation List */}
            <div className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${selectedPhone ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <RefreshCw className="animate-spin text-blue-500" size={24} />
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <MessageSquare className="mx-auto mb-2 opacity-20" size={40} />
                            <p className="text-sm">No chats found</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => (
                            <button
                                key={conv.phoneNumber}
                                onClick={() => setSelectedPhone(conv.phoneNumber)}
                                className={`w-full p-4 flex items-start gap-4 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left ${selectedPhone === conv.phoneNumber ? 'bg-blue-50' : ''}`}
                            >
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 flex-shrink-0">
                                    <User size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate text-sm">+{conv.phoneNumber}</h3>
                                        <span className="text-[10px] text-gray-500 whitespace-nowrap">{formatTime(conv.lastTimestamp)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                                        {conv.type === 'sent' && <CheckCheck size={14} className="text-blue-500" />}
                                        {conv.lastMessage}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-[#e5ddd5] relative ${!selectedPhone ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                {selectedPhone ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white p-3 border-b flex items-center gap-4 shadow-sm z-10">
                            <button
                                onClick={() => setSelectedPhone(null)}
                                className="md:hidden text-gray-600 p-1"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <User size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="font-bold text-gray-900 text-base">+{selectedPhone}</h2>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">WhatsApp Customer</p>
                                </div>
                            </div>
                            <button className="text-gray-500 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400">
                            {chatLoading && messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <RefreshCw className="animate-spin text-blue-500" size={32} />
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isReceived = msg.type === 'received';
                                    return (
                                        <div
                                            key={msg._id || idx}
                                            className={`flex ${isReceived ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`max-w-[85%] p-4 rounded-lg shadow-sm relative ${isReceived ? 'bg-white rounded-tl-none' : 'bg-[#dcf8c6] rounded-tr-none'}`}>
                                                <p className="text-gray-800 text-base whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                                <div className="flex items-center justify-end gap-1 mt-1">
                                                    <span className="text-xs text-gray-500">
                                                        {formatTime(msg.timestamp)}
                                                    </span>
                                                    {!isReceived && <CheckCheck size={16} className="text-blue-500" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Read Only Notice */}
                        <div className="bg-white p-3 border-t text-center text-xs text-gray-500 italic">
                            <span className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                                🔒 Read-only view. Responses are handled by the AI Sales Bot.
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-sm mx-auto">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="text-blue-500" size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">WhatsApp Inbox</h2>
                        <p className="text-sm text-gray-600">
                            Select a customer from the list to view their live WhatsApp conversation with the AI bot.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
