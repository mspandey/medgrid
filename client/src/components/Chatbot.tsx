import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, LifeBuoy } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, limit } from 'firebase/firestore';
import { User } from '../App';

interface Message {
    id: string; // Changed to string for Firestore IDs
    text: string;
    sender: 'user' | 'bot' | 'agent';
    createdAt?: any;
}

interface ChatbotProps {
    user: User | null;
}

const Chatbot = ({ user }: ChatbotProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'bot' | 'live'>('bot');
    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome', text: "Hi! I'm MedGrid AI. Ask me about finding doctors or hospitals!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatId, setChatId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Firestore Listener for Live Chat
    useEffect(() => {
        if (mode === 'live' && chatId) {
            const q = query(
                collection(db, `chats/${chatId}/messages`),
                orderBy('createdAt', 'asc'),
                limit(50)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const msgs: Message[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Message));
                setMessages(msgs);
            });
            return () => unsubscribe();
        }
    }, [mode, chatId]);

    const startLiveChat = async () => {
        setLoading(true);
        try {
            // Create a new chat session
            const docRef = await addDoc(collection(db, 'chats'), {
                userId: user?.id || 'guest',
                userName: user?.name || 'Guest User',
                status: 'active',
                createdAt: serverTimestamp(),
                lastMessage: '',
                unread: 0
            });
            setChatId(docRef.id);
            setMode('live');
            setMessages([]); // Clear bot history for new live chat

            // Add system welcome message
            await addDoc(collection(db, `chats/${docRef.id}/messages`), {
                text: "You are now connected to a live agent. How can we help you?",
                sender: 'agent',
                createdAt: serverTimestamp()
            });

        } catch (err) {
            console.error(err);
            alert("Could not start live chat. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const text = input;
        setInput('');

        if (mode === 'live' && chatId) {
            // Send to Firestore
            try {
                await addDoc(collection(db, `chats/${chatId}/messages`), {
                    text,
                    sender: 'user',
                    createdAt: serverTimestamp()
                });
            } catch (err) {
                console.error("Error sending message:", err);
            }
        } else {
            // Bot Logic
            const userMsg: Message = { id: Date.now().toString(), text, sender: 'user' };
            setMessages(prev => [...prev, userMsg]);
            setLoading(true);

            try {
                const res = await axios.post('http://localhost:8000/api/chat/ask/', { message: text });
                const botMsg: Message = { id: (Date.now() + 1).toString(), text: res.data.response, sender: 'bot' };
                setMessages(prev => [...prev, botMsg]);
            } catch (err) {
                console.error(err);
                setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: "Sorry, I'm having trouble connecting to the server.", sender: 'bot' }]);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center"
                >
                    <MessageSquare size={28} />
                </button>
            )}

            {isOpen && (
                <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className={`${mode === 'live' ? 'bg-blue-600' : 'bg-green-800'} text-white p-4 flex justify-between items-center transition-colors duration-300`}>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                {mode === 'live' ? <LifeBuoy size={20} /> : <Bot size={20} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{mode === 'live' ? 'Live Support' : 'MedGrid Assistant'}</h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-xs opacity-80">{mode === 'live' ? 'Agent Active' : 'AI Online'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {mode === 'bot' && (
                                <button
                                    onClick={startLiveChat}
                                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition"
                                    title="Talk to a human"
                                >
                                    Human?
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                    ? (mode === 'live' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-green-600 text-white rounded-br-none')
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === 'live' ? "Type a message to agent..." : "Ask AI anything..."}
                            className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className={`${mode === 'live' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white p-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
