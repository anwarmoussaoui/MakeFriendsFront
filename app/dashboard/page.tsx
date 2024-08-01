'use client'
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";
import Post from "../components/post";
import axios from "axios";


export interface Post {
    id: number;
    email: string;
    imgUrl: string;
    comments: Comments[];
    content: string;
    countLikes: number;
  }
  export interface Comments {
    ownerPic: string;
    id: number;
    owner: string;
    content: string;
  }





export default function dashboard() {
    const [email, setEmail] = useState(localStorage.getItem('email'));

    const[posts,setPosts] = useState<Post[]>([]);

    const router = useRouter();
    useEffect( () => { 
        const fetchPosts=async ()=>{
            const response = await axios.get(`http://localhost:8080/api/post/profile/${email}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              }
      
            });
            setPosts(response.data as Post[]);
            console.log(response.data);
      
          }
          fetchPosts();

        if(localStorage.getItem('role')!=='User'){
        router.push('/login');
    }},[])
        return (  
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {posts.map(post => (
              <Post
                key={post.id}
                id={post.id}
                email={post.email}
                imageUrl={`/images/${post.imgUrl}`}
                countLikes={post.countLikes}
                content={post.content}
                comments={post.comments}
              />
            ))}
          </div>
    )
    }

