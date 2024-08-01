'use client';
import React, { useState, useEffect } from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import Navbar from '../components/navbar';

const WebSocketTest= () => {
   

    return (
      <>
      <Navbar/>
        <div>
            <h2>WebSocket Test Component</h2>
            <input type="text"  />
            
            <input type="text" />
            
            <div>
                <button  >Send Message</button>
            </div>
        </div></>
    );
};

export default WebSocketTest;
