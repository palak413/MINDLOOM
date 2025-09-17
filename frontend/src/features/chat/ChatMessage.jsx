import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function ChatMessage({ message }) {
    const isAssistant = message.role === 'assistant';

    return (
        <div className={cn(
            "flex items-start gap-3 w-full",
            !isAssistant && "justify-end"
        )}>
            {isAssistant && (
                <Avatar className="w-8 h-8 border">
                    <AvatarImage src="/images/aura-avatar.png" alt="Aura" />
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
            )}
            <div className={cn(
                "max-w-xs md:max-w-md p-3 rounded-lg whitespace-pre-wrap",
                isAssistant ? "bg-white text-gray-800 shadow-sm" : "bg-green-600 text-white"
            )}>
                <p className="text-sm">{message.content}</p>
            </div>
        </div>
    );
}

export default ChatMessage;