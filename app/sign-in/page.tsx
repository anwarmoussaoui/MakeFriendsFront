'use client';
import  React, { useState } from 'react';
import './styles.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
const signIn = () => {
   const router = useRouter();
   const [email, setEmail] = useState('');
   const [name, setName] = useState('');
   const [lastName, setLastName] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[0-9]).{8,}$/;
    e.preventDefault();
    if (!emailPattern.test(email)) {
      Swal.fire('Please enter a valid email address');
    } else if (!passwordPattern.test(password)) {
      Swal.fire('Password must be at least 8 characters long and contain at least one number');
    } else if (password !== confirmPassword) {
      Swal.fire("Passwords don't match");
    } else {
      try {
        const response = await axios.post('http://localhost:8080/api/public/register', {
          email,
          name,
          lastName,
          password
        });
        Swal.fire(response.data);
        
      } catch (error) {
        Swal.fire('An error occurred while creating the account');
      }
    }
   }
    return (
      <div className="container">
      <div className="title">Registration</div>
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="user-details">
            <div className="input-box">
              <span className="details">Name</span>
              <input type="text" placeholder="Enter your name" required 
              value={name}
              onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="input-box">
              <span className="details">LastName</span>
              <input type="text" placeholder="Enter your username" required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}/>
            </div>
            <div className="input-box">
              <span className="details">Email or username</span>
              <input type="text" placeholder="Enter your email" required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="input-box">
              <span className="details">Password</span>
              <input type="text" placeholder="Enter your password" required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="input-box">
              <span className="details">Confirm Password</span>
              <input type="text" placeholder="Confirm your password" required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>
          </div>
        
          <div className="button">
            <input type="submit" value="Register"/>
          </div>
          <div className="signup-link">
              Already have an account? <Link href="/login">SignIn now</Link>
           </div>
        </form>
      </div>
    </div>
    )
}
export default signIn