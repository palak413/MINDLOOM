import React, { useState, useRef, useEffect } from 'react';
import apiClient from '@/lib/axios';
import ChatMessage from './ChatMessage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ChatWindow() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am Aura, your wellness assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewportRef = useRef(null);

    // Automatically scroll to the bottom when new messages are added
    useEffect(() => {
        if (scrollViewportRef.current) {
            scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        // Pass a function to setMessages to get the most up-to-date state
        setMessages(prevMessages => [...prevMessages, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        
        // Use the current state for the API call
        const historyForApi = [...messages, userMessage];

        try {
            const response = await apiClient.post('/chat', {
                message: currentInput,
                history: historyForApi.slice(1), // Exclude the initial system message from history sent
            });
            
            const assistantMessage = { role: 'assistant', content: response.data.data.response };
            setMessages(prevMessages => [...prevMessages, assistantMessage]);

        } catch (error) {
            const errorMessage = { role: 'assistant', content: 'Sorry, I seem to be having trouble connecting. Please try again.' };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[75vh]">
            <CardHeader className="border-b">
                <p className="font-semibold">Chat with Aura</p>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-6" viewportRef={scrollViewportRef}>
                    <div className="space-y-6">
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} message={msg} />
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3">
                                <Avatar className="w-8 h-8 border">
                                    <AvatarImage src="/images/aura-avatar.png" />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <div className="max-w-xs p-3 rounded-lg bg-white text-gray-800 shadow-sm">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></span>
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></span>
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-300"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
                <form onSubmit={handleSend} className="flex items-center gap-2 w-full">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        autoComplete="off"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()} className="bg-green-500 hover:bg-green-600">
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}

export default ChatWindow;