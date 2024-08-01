'use client';
import { useEffect, useState } from "react";
import Profile from "../components/Profile";
import Navbar from "../components/navbar";

const ProfilePage = () => {
  const [email, setEmail] = useState<string | null>("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);
    if (!storedEmail) {
      window.location.href = '/login';
    }   
  }, []);

  return (

    
    <div>
      
      {email && <Profile email={email} />}
    </div>
  );
};

export default ProfilePage;
