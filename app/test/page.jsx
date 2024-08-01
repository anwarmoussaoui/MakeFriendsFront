'use client';
import React, { useState, useEffect } from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const WebSocketTest= () => {
    const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [stompClient, setStompClient] = useState(null);

   useEffect(()  => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe('/topic/messages', (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    });

    setStompClient(client);

   
  }, []);

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {
    if (message.trim()) {
      const Message = {
        senderId:nickname,
        content: message,
      };

      stompClient.send('/app/chat', {}, JSON.stringify(Message));
      setMessage('');
    }
  };

    return (
        <div>
            <h2>WebSocket Test Component</h2>
            <input type="text" value={nickname} onChange={handleNicknameChange} />
            <input type="text" value={message} onChange={handleMessageChange} />
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
            <div>
                <button  onClick={sendMessage}>Send Message</button>
            </div>
        </div>
    );
};

export default WebSocketTest;
