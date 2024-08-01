'use client';
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SearchDropdown from './search'; // Adjust the import path accordingly

interface Message {
  id: number;
  content: string;
  senderId: string;
  timestamp: string; // Example timestamp type, adjust as per actual data
}

export default function Navbar() {
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [open, setOpen] = useState(false);
  const [notifSidebarOpen, setNotifSidebarOpen] = useState(false);
  const [navSidebarOpen, setNavSidebarOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const senderId = localStorage.getItem('email');
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/message/notif', {
          params: { recipientId: senderId },
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setNotifications(response.data as Message[]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  function viewMessage(senderId: string): void {
    localStorage.setItem('recipientId', senderId);
    router.push('/dashboard/messages');
  }

  return (
    <nav>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <button className="btn btn-ghost btn-circle" onClick={() => setNavSidebarOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        </div>
        <div className="navbar-center">
          <Link href="/dashboard" className="btn btn-ghost text-xl">MakeFriends</Link>
        </div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle" onClick={() => setOpen(!open)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {open && (
            <SearchDropdown
              placeholder="Type here"
              searchUrl="http://localhost:8080/api/public/searchUsersByEmail"
              onSelect={(user) => {
                router.push('/profile/' + user);
                // Handle user selection
              }}
            />
          )}
        </div>
        <div>
          <button className="btn m-1" onClick={() => setNotifSidebarOpen(true)}>
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Sidebar */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform ${
          navSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-black bg-opacity-50`}>
        <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg">
          <div className="p-4 flex justify-between items-center">
            <h3 className="text-xl font-bold">Menu</h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setNavSidebarOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              <li><Link href="/dashboard" onClick={() => setNavSidebarOpen(false)}>Homepage</Link></li>
              <li><Link href="/login" onClick={() => setNavSidebarOpen(false)}>Logout</Link></li>
              <li><Link href="/profileSettings" onClick={() => setNavSidebarOpen(false)}>Profile Settings</Link></li>
              <li><Link href="/dashboard/CreatePost" onClick={() => setNavSidebarOpen(false)}>Add post</Link></li>
              <li><Link href={`/profile/${localStorage.getItem('email')}`} onClick={() => setNavSidebarOpen(false)}>Profile</Link></li>
              <li><Link href="/dashboard/changePassword" onClick={() => setNavSidebarOpen(false)}>Change Password</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Notification Sidebar */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform ${
          notifSidebarOpen ? "translate-x-0" : "translate-x-full"
        } bg-black bg-opacity-50`}>
        <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg">
          <div className="p-4 flex justify-between items-center">
            <h3 className="text-xl font-bold">Notifications</h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setNotifSidebarOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto h-full p-4">
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <div key={index} className="p-2 border-b border-gray-200">
                  <button className="block font-bold text-lg" onClick={() => viewMessage(notif.senderId)}>
                    {notif.senderId}
                    <p className="text-sm text-gray-600">{notif.content}</p>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No notifications</p>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
