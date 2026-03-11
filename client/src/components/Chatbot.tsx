import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

interface Message {
    id: string; // Changed to string for Firestore IDs
    text: string;
    sender: 'user' | 'bot' | 'agent';
    createdAt?: any;
    options?: string[];
}

const CHATBOT_MENUS = {
    main: [
        "1. Quick Navigation",
        "2. Product or Service Help",
        "3. Account & Login Help",
        "4. Customer Support",
        "5. FAQs",
        "6. Feedback",
        "Others"
    ],
    subMenus: {
        "1. Quick Navigation": ["🏠 Home", "ℹ️ About MedGrid", "💊 Services / Products", "📄 Documentation", "💰 Pricing / Plans", "📞 Contact Support", "Back to Main Menu"],
        "2. Product or Service Help": ["What is MedGrid?", "How does MedGrid work?", "Features overview", "Who is it for?", "Back to Main Menu"],
        "3. Account & Login Help": ["Login problem", "Forgot password", "Create account", "Account settings help", "Back to Main Menu"],
        "4. Customer Support": ["Talk to human support", "Submit support ticket", "Report bug", "Request feature", "Back to Main Menu"],
        "5. FAQs": ["Is MedGrid secure?", "Is patient data encrypted?", "Pricing questions", "Supported integrations", "Back to Main Menu"],
        "6. Feedback": ["Send feedback", "Report issue", "Suggest improvement", "Back to Main Menu"]
    }
};

const SUB_MENU_RESPONSES: Record<string, string> = {
    "💊 Services / Products": "We offer a range of services: Hospital locator, real-time ICU bed tracking, blood donation matching, and an AI-powered symptom checker.",
    "📄 Documentation": "Our documentation provides guides on how to use MedGrid. Please visit our Help Center page.",
    "💰 Pricing / Plans": "MedGrid is completely free for patients! Hospitals and clinics may have customized subscription plans. Contact our sales team for more info.",
    "📞 Contact Support": "You can reach us at support@medgrid.com or call 1-800-MEDGRID. Our team is available 24/7.",
    "What is MedGrid?": "MedGrid is a comprehensive platform that connects patients with nearby hospitals, tracks live ICU bed availability, and helps find blood donors instantly.",
    "How does MedGrid work?": "MedGrid uses your location and our partner hospital network to show you real-time data about beds, doctors, and blood donors. Simply navigate to the specific service you need from our homepage.",
    "Features overview": "1. Hospital Locator\n2. Real-time ICU Bed Check\n3. Blood Donor Network\n4. AI Assistant\n5. Ambulance Connecting Service",
    "Who is it for?": "MedGrid is designed for:\n- Patients seeking quick medical services.\n- Hospitals managing their bed and doctor availability.\n- Ambulance drivers finding the fastest routes.",
    "Login problem": "If you're having trouble logging in, please clear your browser cache, ensure you are using the correct email, or click on 'Forgot password' to reset your credentials.",
    "Forgot password": "To reset your password:\n1. Go to the Login page.\n2. Click on 'Forgot Password'.\n3. Enter your registered email address.\n4. Check your email for a password reset link.",
    "Create account": "To create an account:\n1. Click the 'Login' button at the top right.\n2. Switch to the 'Register' tab.\n3. Fill in your details.\n4. Click 'Submit' to create your account.",
    "Account settings help": "You can update your account settings by logging in, clicking your profile icon, and selecting 'Settings'. From there, you can update your contact information.",
    "Submit support ticket": "To submit a support ticket, please email us directly at support@medgrid.com with a detailed description of your issue, and our team will respond within 24 hours.",
    "Report bug": "We appreciate your help in improving MedGrid! Please email bugs@medgrid.com with the steps to reproduce the issue and screenshots if possible.",
    "Request feature": "Got an idea for MedGrid? We'd love to hear it! Send your feature requests to feedback@medgrid.com.",
    "Is MedGrid secure?": "Yes! We use industry-standard encryption to protect all your personal and medical information. Your privacy is our top priority.",
    "Is patient data encrypted?": "Absolutely. All patient data is end-to-end encrypted both in transit and at rest. We comply with global healthcare data protection standards.",
    "Pricing questions": "MedGrid is a free platform for individual users. If you are a hospital or partner, please contact sales@medgrid.com for partnership pricing.",
    "Supported integrations": "MedGrid currently integrates with several major Hospital Management Information Systems (HMIS). Contact our technical team for specific integration documentation.",
    "Send feedback": "We value your feedback! Please drop us an email at feedback@medgrid.com and let us know how we can improve.",
    "Report issue": "If you face a critical issue, please contact our 24/7 technical hotline at 1-800-MEDGRID-TECH.",
    "Suggest improvement": "Have a suggestion? We are always evolving! Send your ideas to feedback@medgrid.com."
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "Hi! I'm MedGrid AI. How can I help you today?",
            sender: 'bot',
            options: CHATBOT_MENUS.main
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const startLiveChat = async () => {
        setLoading(true);
        setTimeout(() => {
            const botMsg: Message = {
                id: Date.now().toString(),
                text: "Our support team is offline at the moment.",
                sender: 'bot',
                options: CHATBOT_MENUS.main
            };
            setMessages(prev => [...prev, botMsg]);
            setLoading(false);
        }, 500);
    };

    const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
        e?.preventDefault();
        const textToUse = textOverride || input;
        if (!textToUse.trim()) return;

        const text = textToUse;
        if (!textOverride) {
            setInput('');
        }

        // Bot Logic
        const userMsg: Message = { id: Date.now().toString(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);

        // Menu Logic

        // 1. If clicked a main menu item
        if (Object.keys(CHATBOT_MENUS.subMenus).includes(text)) {
            setLoading(true);
            setTimeout(() => {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `Here are the options for ${text}:`,
                    sender: 'bot',
                    options: CHATBOT_MENUS.subMenus[text as keyof typeof CHATBOT_MENUS.subMenus]
                };
                setMessages(prev => [...prev, botMsg]);
                setLoading(false);
            }, 500);
            return;
        }

        // 2. If returning to main menu
        if (text === "Back to Main Menu") {
            setLoading(true);
            setTimeout(() => {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Here is the main menu. How else can I assist you?",
                    sender: 'bot',
                    options: CHATBOT_MENUS.main
                };
                setMessages(prev => [...prev, botMsg]);
                setLoading(false);
            }, 500);
            return;
        }

        // 2.5 If clicked "Others"
        if (text === "Others") {
            setLoading(true);
            setTimeout(() => {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Please type your question or response below:",
                    sender: 'bot',
                    options: ["Back to Main Menu"]
                };
                setMessages(prev => [...prev, botMsg]);
                setLoading(false);
            }, 500);
            return;
        }

        // 3. If clicked a sub-menu item
        const allSubOptions = Object.values(CHATBOT_MENUS.subMenus).flat();
        if (allSubOptions.includes(text) && text !== "Talk to human support") {
            setLoading(true);

            // Add Quick Navigation Routing
            if (text === "🏠 Home") {
                window.location.href = "/";
                return;
            }
            if (text === "ℹ️ About MedGrid") {
                window.location.href = "/about"; // Assuming an /about route exists
                return;
            }

            const responseText = SUB_MENU_RESPONSES[text] || `Thank you for selecting "${text}". Your request has been noted by our system!`;

            setTimeout(() => {
                const botMsg1: Message = {
                    id: (Date.now() + 1).toString(),
                    text: responseText,
                    sender: 'bot'
                };
                const botMsg2: Message = {
                    id: (Date.now() + 2).toString(),
                    text: "Do you need help with anything else?",
                    sender: 'bot',
                    options: CHATBOT_MENUS.main
                };
                setMessages(prev => [...prev, botMsg1, botMsg2]);
                setLoading(false);
            }, 800);
            return;
        }

        // 4. Specific Action Handlers
        if (text.toLowerCase().includes('talk to human') || text === "Talk to human support" || text === "Talk to human agent") {
            startLiveChat();
            return;
        }

        // Hardcode immediate ambulance response
        if (text.toLowerCase().includes('ambulance')) {
            setLoading(true);
            setTimeout(() => {
                const botMsg1: Message = { id: (Date.now() + 1).toString(), text: "Connecting you to an ambulance driver...", sender: 'bot' };
                const botMsg2: Message = {
                    id: (Date.now() + 2).toString(),
                    text: "If you have any other query, please select an option below or type your question:",
                    sender: 'bot',
                    options: CHATBOT_MENUS.main
                };
                setMessages(prev => [...prev, botMsg1, botMsg2]);
                setLoading(false);
            }, 800);
            return;
        }

        // Hardcode blood donor response
        if (text.toLowerCase().includes('blood donor')) {
            setLoading(true);
            setTimeout(() => {
                const botMsg1: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Here is how you can register as a Blood Donor on MedGrid:\n\n1. From the Home Page, click on the 'Donate Blood' card or navigate to the Blood Donation section.\n2. Fill out the comprehensive Blood Donor Registration Form with your personal details, blood group, and health history.\n3. Review the health criteria and agree to the voluntary consent.\n4. Click 'Register as Donor' to securely save your information to our database.\n5. You will instantly receive a confirmation email with details on which partner hospital to visit for your quick screening and donation!",
                    sender: 'bot'
                };
                const botMsg2: Message = {
                    id: (Date.now() + 2).toString(),
                    text: "If you have any other query, please select an option below or type your question:",
                    sender: 'bot',
                    options: CHATBOT_MENUS.main
                };
                setMessages(prev => [...prev, botMsg1, botMsg2]);
                setLoading(false);
            }, 800);
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post('http://localhost:8000/api/chat/ask/', { message: text });
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: res.data.response,
                sender: 'bot',
                options: ["Talk to human agent", "Back to Main Menu"]
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error(err);

            // Show error but add options so they aren't stuck
            const fallbackMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting to the server.",
                sender: 'bot',
                options: ["Talk to human agent", "Back to Main Menu"]
            };
            setMessages(prev => [...prev, fallbackMsg]);
        } finally {
            setLoading(false);
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
                <div className="bg-white w-80 md:w-96 h-[500px] max-h-[calc(100vh-100px)] rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-green-800 text-white p-4 flex justify-between items-center transition-colors duration-300 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">MedGrid Assistant</h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-xs opacity-80">AI Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className="w-full flex flex-col space-y-2">
                                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.sender === 'user'
                                        ? 'bg-green-600 text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                                {msg.options && (
                                    <div className="flex flex-col gap-2 mt-2 w-full justify-start px-2 animate-fade-in-up">
                                        {msg.options.map((reply, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSend(undefined, reply)}
                                                className="text-sm bg-white text-green-700 hover:bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl transition-all font-medium flex justify-start text-left shadow-sm hover:scale-[1.02]"
                                            >
                                                {reply}
                                            </button>
                                        ))}
                                    </div>
                                )}
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
                            placeholder="Ask AI anything..."
                            className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
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
