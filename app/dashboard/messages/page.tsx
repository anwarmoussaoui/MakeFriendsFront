'use client';
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import axios from "axios";
import Image from 'next/image';

interface Message {
  id: number;
  content: string;
  senderId: string;
  image: string;
  timestamp: string; // Example timestamp type, adjust as per actual data
}

const styles = {
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #ddd',
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  recipientInfo: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default function MessageComponent() {

    const scrollRef = useRef<HTMLDivElement>(null);
const [image, setImage] = useState<File | null>(null);
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [recipientId, setRecipientId] = useState(localStorage.getItem('recipientId'));
  const senderId = typeof window !== 'undefined' ? localStorage.getItem('email') : null;
  const [imageName, setImageName] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    }
  };
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/message/notif', {
        params: { recipientId: senderId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNotifications(response.data as Message[]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
console.log(recipientId +" test"+ senderId)
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/message`, {
        params: { senderId :senderId, recipientId :recipientId},
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(response.data as Message[]);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  useEffect(() => {

    if (true) {
      setRecipientId(localStorage.getItem('recipientId'));

      

      fetchNotifications();
      fetchMessages();
    }
    if (scrollRef.current) {

      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  const viewMessage = (name: string) => {
    localStorage.setItem('recipientId', name);
    setRecipientId(name);
    // No need to reload the page
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!senderId || !recipientId) return;
    try {

        const formData = new FormData();
        if (image ) {
    formData.append('image', image);}
    formData.append('senderId', senderId);
    formData.append('recipientId', recipientId);
    formData.append('content', message);
      const response = await axios.post(
        'http://localhost:8080/api/message',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      console.log(response.data);
      setMessages([...messages, response.data]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="drawer-container w-1/3 h-100 bg-gray-100" style={{ maxHeight: '80vh' }}>
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-side">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-4">
              {notifications.map((notif, index) => (
                <li key={index} className="p-2 rounded-lg hover:bg-gray-200">
                  <button
                    className="block font-bold text-lg"
                    onClick={() => viewMessage(notif.senderId)}
                  >
                    {notif.senderId}
                    <p className="text-sm text-gray-600">{notif.content}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="chat-container w-2/3 flex flex-col p-4 h-100" style={{ maxHeight: '90vh' }}>
        <div className="flex-grow overflow-auto">
          <div style={styles.headerContainer}>
            <div style={styles.avatarContainer}>
              <img
                alt="Chat participant"
                src="/images/medium.webp"
                style={styles.avatar}
              />
            </div>
            <div style={styles.recipientInfo}>{recipientId}</div>
          </div>
          <div className="scroll" ref={scrollRef} style={{ maxHeight: '60vh' }}>
            {messages.map((message) => (
              <div key={message.id}>
                {message.senderId !== senderId ? (
                  <div className="flex justify-start w-full mb-2">
                    <div className="chat chat-start">
                      <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                          <img
                            alt="Tailwind CSS chat bubble component"
                            src="/images/medium.webp"
                          />
                        </div>
                      </div>
                      <div className="chat-header">
                        {message.senderId}
                        <time className="text-xs opacity-50">{message.timestamp}</time>
                      </div>
                      {message.content && (
                      <div className="chat-bubble">{message.content}</div>    
                      )}
                      
                     {message.image &&( <Image
                       src={`/images/${message.image}`} 
        alt="Dynamic image"
        width={500}
        height={500}
      />)}
                      
                     
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end w-full mb-2">
                    <div className="chat chat-end">
                      <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                          
                        </div>
                      </div>
                      <div className="chat-header">
                        {message.senderId}
                        <time className="text-xs opacity-50">{message.timestamp}</time>
                      </div>
                      {message.content && (
                      <div className="chat-bubble">{message.content}</div>    
                      )}
                      
                     {message.image &&( <Image
                       src={`/images/${message.image}`} 
        alt="Dynamic image"
        width={500}
        height={500}
      />)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <form className="container" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="input input-bordered w-full mb-2"
      />
      <div className="mb-2">
        <label htmlFor="imageInput" className="btn btn-outline">
          Upload Image
        </label>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        {imageName && <span className="ml-2">{imageName}</span>}
      </div>
      <button type="submit" className="btn btn-primary">
        Send
      </button>
    </form>
      </div>
    </div>
  );
}
