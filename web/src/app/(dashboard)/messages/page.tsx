"use client";

import { useState } from "react";

interface Message {
    id: number;
    content: string;
    sender: "me" | "operator";
    timestamp: string;
    attachment?: string;
}

interface Conversation {
    id: number;
    name: string;
    role: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    messages: Message[];
}

const conversations: Conversation[] = [
    {
        id: 1,
        name: "Node Central",
        role: "Opérateur Principal",
        avatar: "hub",
        lastMessage: "Analyse terminée pour DataFlow Industries",
        timestamp: "14:32",
        unread: 2,
        messages: [
            { id: 1, content: "Bonjour, l'analyse du lead DataFlow Industries est en cours.", sender: "operator", timestamp: "14:15" },
            { id: 2, content: "Parfait, merci pour la rapidité.", sender: "me", timestamp: "14:18" },
            { id: 3, content: "Analyse terminée. Score: 87. Signaux positifs détectés.", sender: "operator", timestamp: "14:32" },
            { id: 4, content: "Rapport PDF disponible dans la Salle de Guerre.", sender: "operator", timestamp: "14:32", attachment: "rapport_dataflow.pdf" },
        ],
    },
    {
        id: 2,
        name: "Support Technique",
        role: "Assistance",
        avatar: "support_agent",
        lastMessage: "Votre demande de virement a été traitée",
        timestamp: "Hier",
        unread: 0,
        messages: [
            { id: 1, content: "J'ai une question sur les délais de virement.", sender: "me", timestamp: "Hier 10:20" },
            { id: 2, content: "Les virements sont traités sous 24-48h ouvrées.", sender: "operator", timestamp: "Hier 10:45" },
            { id: 3, content: "Votre demande de virement a été traitée avec succès.", sender: "operator", timestamp: "Hier 16:30" },
        ],
    },
];

export default function MessagesPage() {
    const [activeConversation, setActiveConversation] = useState<Conversation>(conversations[0]);
    const [newMessage, setNewMessage] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        // TODO: Send message via API
        setNewMessage("");
    };

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">

            <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col md:flex-row">
                {/* Conversation List */}
                <aside className="w-full md:w-80 border-r border-gray-100 flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                        <h1 className="text-lg font-serif text-black">Messagerie Directe</h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                            Direct Node
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setActiveConversation(conv)}
                                className={`w-full p-4 text-left border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${activeConversation.id === conv.id ? "bg-gray-50" : ""
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg text-gray-600">
                                            {conv.avatar}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-black truncate">
                                                {conv.name}
                                            </h3>
                                            <span className="text-[10px] text-gray-400">
                                                {conv.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                                            {conv.role}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate mt-1">
                                            {conv.lastMessage}
                                        </p>
                                    </div>
                                    {conv.unread > 0 && (
                                        <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                                            {conv.unread}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Message Thread */}
                <div className="flex-1 flex flex-col min-h-[70vh]">
                    {/* Thread Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-lg text-gray-600">
                                    {activeConversation.avatar}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-black">
                                    {activeConversation.name}
                                </h2>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                                    {activeConversation.role}
                                </p>
                            </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-black transition-colors">
                            <span className="material-symbols-outlined text-lg">more_vert</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {activeConversation.messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[75%] p-4 ${msg.sender === "me"
                                            ? "bg-black text-white"
                                            : "bg-gray-50 text-black border border-gray-100"
                                        }`}
                                >
                                    <p className="text-sm">{msg.content}</p>
                                    {msg.attachment && (
                                        <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">
                                                attach_file
                                            </span>
                                            <span className="text-xs underline">{msg.attachment}</span>
                                        </div>
                                    )}
                                    <p
                                        className={`text-[10px] mt-2 ${msg.sender === "me" ? "text-white/50" : "text-gray-400"
                                            }`}
                                    >
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <form onSubmit={handleSend} className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-black transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    attach_file
                                </span>
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Écrire un message..."
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 text-sm placeholder:text-gray-400 focus:border-black focus:ring-0 outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                className="p-3 bg-black text-white hover:bg-gray-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">send</span>
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
