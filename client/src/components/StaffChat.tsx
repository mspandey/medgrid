import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { MessageSquare, Send, User } from 'lucide-react';

interface ChatSession {
    id: string;
    userName: string;
    userId: string;
    status: 'active' | 'closed';
    lastMessage: string;
    createdAt: any;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    createdAt: any;
}

const StaffChat = () => {
    const [chats, setChats] = useState<ChatSession[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [reply, setReply] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Listen for active chat sessions
    useEffect(() => {
        const q = query(
            collection(db, 'chats'),
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sessions: ChatSession[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ChatSession));
            setChats(sessions);
        });

        return () => unsubscribe();
    }, []);

    // Listen for messages in selected chat
    useEffect(() => {
        if (!selectedChatId) return;

        const q = query(
            collection(db, `chats/${selectedChatId}/messages`),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: Message[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message));
            setMessages(msgs);
            // Scroll to bottom
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });

        return () => unsubscribe();
    }, [selectedChatId]);

    const sendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || !selectedChatId) return;

        try {
            await addDoc(collection(db, `chats/${selectedChatId}/messages`), {
                text: reply,
                sender: 'agent',
                createdAt: serverTimestamp()
            });
            setReply('');
        } catch (err) {
            console.error("Error sending reply:", err);
        }
    };

    const closeChat = async () => {
        if (!selectedChatId) return;
        if (window.confirm("End this chat session?")) {
            try {
                await updateDoc(doc(db, 'chats', selectedChatId), {
                    status: 'closed'
                });
                setSelectedChatId(null);
            } catch (err) {
                console.error("Error closing chat:", err);
            }
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex">
            {/* Sidebar: Active Chats */}
            <div className="w-1/3 border-r border-gray-100 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-white">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <MessageSquare className="text-green-600" size={20} />
                        Active Inquiries
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {chats.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10 text-sm">No active chats</div>
                    ) : (
                        chats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChatId(chat.id)}
                                className={`w-full text-left p-3 rounded-xl transition flex items-center gap-3 ${selectedChatId === chat.id ? 'bg-white shadow-md border border-green-100' : 'hover:bg-gray-100'}`}
                            >
                                <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                    <User size={16} />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="font-bold text-gray-800 text-sm">{chat.userName}</div>
                                    <div className="text-xs text-gray-400 truncate">Click to respond</div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main: Chat Window */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedChatId ? (
                    <>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="font-bold text-gray-800">
                                Chatting with <span className="text-blue-600">{chats.find(c => c.id === selectedChatId)?.userName}</span>
                            </div>
                            <button onClick={closeChat} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100 transition">
                                End Chat
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.sender === 'agent' ? 'bg-green-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendReply} className="p-4 border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type your reply..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                            <button type="submit" disabled={!reply.trim()} className="bg-green-600 text-white p-2 rounded-xl hover:bg-green-700 transition disabled:opacity-50">
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                        <MessageSquare size={64} className="mb-4 opacity-20" />
                        <p>Select a chat to start responding</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffChat;
