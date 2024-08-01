'use client'
import  React, { useEffect, useState } from 'react';
import './styles.css';
import Link from 'next/link';
import axios from 'axios';
import  { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const login =   () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    useEffect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', '');
        localStorage.setItem('role', '');
        localStorage.setItem('name', '');
        localStorage.setItem('email', '');
        localStorage.setItem('lastName', '');
      }
    }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   
    e.preventDefault();
    try{const response = await axios.post('http://localhost:8080/api/public/login', {
        email,
        password,
      });
         localStorage.setItem('token', response.data.token);
         localStorage.setItem('role', response.data.role);
         localStorage.setItem('name', response.data.name);
         localStorage.setItem('email', response.data.email);
         localStorage.setItem('lastName', response.data.lastName);
      console.log(response.data);
      if(response.data.role === "Admin"){
        router.push('admin');
      }else if(response.data.role === 'User'){
         Swal.fire("you're logged in");
        router.push('dashboard');
        console.log(response.data.role);
      }
      }
      catch (error) {
         Swal.fire("password or email are incorrect");
      
      console.error(error);
    }
  };
    return (
        <div className="wrapper">
        <div className="title">
           Login Form
        </div>
        <form onSubmit={handleSubmit}>
           <div className="field">
              <input type="text" required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
              <label>Email Address</label>
           </div>
           <div className="field">
              <input type="password" required
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
              <label>Password</label>
           </div>
           <div className="content">
              
              <div className="pass-link">
                 <a href="#">Forgot password?</a>
              </div>
           </div>
           <div className="field">
              <input type="submit" value="Login"/>
           </div>
           <div className="signup-link">
              Not a member? <Link href="/sign-in">Signup now</Link>
           </div>
        </form>
     </div>
    )
}
export default login