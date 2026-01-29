"use client";

import React, { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout";
import {
  ChatBubble,
  ConversationItem,
} from "@/components/chat/chat-components";
import { Send, Paperclip, Search, MoreVertical, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: "Support Technique",
    lastMessage: "Votre ticket #1234 a été résolu",
    time: "10:30",
    unread: 2,
  },
  {
    id: 2,
    name: "Maria (Account Manager)",
    lastMessage: "On fait un point demain ?",
    time: "Hier",
    unread: 0,
  },
  {
    id: 3,
    name: "Finance Team",
    lastMessage: "Virement confirmé pour Janvier",
    time: "Mar",
    unread: 0,
  },
];

const MOCK_MESSAGES = [
  {
    id: 1,
    text: "Bonjour, j'ai une question sur ma dernière commission.",
    isMe: true,
    time: "10:15",
  },
  {
    id: 2,
    text: "Bonjour ! Je regarde ça tout de suite. Quel est le numéro de transaction ?",
    isMe: false,
    time: "10:18",
  },
  { id: 3, text: "C'est la #TRX-9988", isMe: true, time: "10:20" },
  {
    id: 4,
    text: "Merci. Je vois qu'elle est en cours de validation bancaire. Elle devrait arriver demain.",
    isMe: false,
    time: "10:25",
  },
];

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(1);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      isMe: true,
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate reply
    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        text: "Bien reçu, nous traitons votre demande.",
        isMe: false,
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  };

  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] bg-white font-sans text-text-main">
      <div className="flex h-full overflow-hidden border-t border-black/5">
        {/* Sidebar - Conversation List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-black/5 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-black/5">
            <h2 className="text-lg font-serif mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-9 bg-white border-gray-200"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {MOCK_CONVERSATIONS.map((conv) => (
              <ConversationItem
                key={conv.id}
                {...conv}
                active={activeConv === conv.id}
                onClick={() => setActiveConv(conv.id)}
              />
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="hidden md:flex flex-1 flex-col bg-white">
          {/* Chat Header */}
          <div className="h-16 border-b border-black/5 flex justify-between items-center px-6 shrink-0">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-sm">Support Technique</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-xs text-gray-500">En ligne</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.text}
                isMe={msg.isMe}
                timestamp={msg.time}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-black/5 bg-white">
            <div className="flex gap-4 max-w-4xl mx-auto">
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 rounded-full"
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Écrivez votre message..."
                className="flex-1 rounded-full border-gray-200 focus-visible:ring-black"
              />
              <Button
                onClick={handleSend}
                className="shrink-0 rounded-full bg-black hover:bg-black/90 px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2">
              Appuyez sur Entrée pour envoyer
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
