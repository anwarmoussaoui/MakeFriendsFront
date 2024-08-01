'use client';
import { useState, useEffect } from 'react';

interface ChatProps {
    username: string;
}

interface ChatMessage {
    targetUsername: string;
    content: string;
}

const Chat: React.FC<ChatProps> = ({ username='admin' }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    const [targetUsername, setTargetUsername] = useState<string>('');
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8080/chat?username=${username}`);
        setWs(socket);

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socket.onmessage = (event) => {
            setMessages(prevMessages => [...prevMessages, event.data]);
        };

        socket.onclose = (event) => {
            console.log('Disconnected from WebSocket server', event);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            socket.close();
        };
    }, [username]);

    const sendMessage = () => {
        if (ws && message && targetUsername) {
            const chatMessage: ChatMessage = {
                targetUsername: targetUsername,
                content: message
            };
            ws.send(JSON.stringify(chatMessage));
            setMessage('');
        }
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={targetUsername}
                    onChange={(e) => setTargetUsername(e.target.value)}
                    placeholder="Enter target username"
                />
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
        </div>
    );
};

export default Chat;
