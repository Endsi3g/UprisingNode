"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatBubbleProps {
  message: string;
  isMe: boolean;
  timestamp: string;
  avatar?: string;
}

export function ChatBubble({
  message,
  isMe,
  timestamp,
  avatar,
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-3 max-w-[80%]",
        isMe ? "ml-auto flex-row-reverse" : "",
      )}
    >
      <Avatar className="w-8 h-8 mt-1">
        <AvatarImage src={avatar || ""} />
        <AvatarFallback>{isMe ? "MOI" : "SUP"}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex flex-col gap-1 p-4 text-sm rounded-2xl",
          isMe
            ? "bg-black text-white rounded-tr-sm"
            : "bg-gray-100 text-gray-800 rounded-tl-sm",
        )}
      >
        <p>{message}</p>
        <span
          className={cn(
            "text-[10px] opacity-70 mt-1",
            isMe ? "text-right text-gray-300" : "text-gray-500",
          )}
        >
          {timestamp}
        </span>
      </div>
    </div>
  );
}

interface ConversationItemProps {
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  active?: boolean;
  onClick: () => void;
}

export function ConversationItem({
  name,
  lastMessage,
  time,
  unread,
  active,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 flex gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100",
        active && "bg-gray-50 border-l-4 border-l-black",
      )}
    >
      <Avatar>
        <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-medium text-sm truncate">{name}</span>
          <span className="text-[10px] text-gray-400 shrink-0">{time}</span>
        </div>
        <p
          className={cn(
            "text-xs truncate",
            unread ? "text-black font-medium" : "text-gray-500",
          )}
        >
          {lastMessage}
        </p>
      </div>
      {unread ? (
        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center shrink-0">
          {unread}
        </span>
      ) : null}
    </button>
  );
}
