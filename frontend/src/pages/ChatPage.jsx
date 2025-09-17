import React from 'react';
import ChatWindow from '../features/chat/ChatWindow';

function ChatPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
            <p className="text-gray-600 mb-6">Aura is here to listen and offer support whenever you need it.</p>
            <ChatWindow />
        </div>
    );
}

export default ChatPage;