'use client';
import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import Image from 'next/image'; // Assuming you're using Next.js for the project
import axios from 'axios';
import  { useParams, useRouter } from 'next/navigation';
import Post from '@/app/components/post';
import { profile } from 'console';
import { emit } from 'process';
import { Router } from 'next/router';
import Navbar from '@/app/components/navbar';

type User = {
  name: string;
  nickname: string;
  email: string;
  photo: string;
  followers: number;
  posts: string[];
};
export interface Profile {
  email: string;
  name: string;
  nickname: string;
  img: string;
  posts: Post[];
}

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
const ProfilePage: React.FC = () => {
  const rou =useRouter();
  const[posts,setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState(0);
  const router = useParams();
  const [user,setUser] = useState<User>({
    name: 'John Doe',
    nickname: 'johnd',
    email: 'johndoe@example.com',
    photo: 'medium.webp', // Make sure this image exists in public/images
    followers: 120,
    posts: [
      'This is my first post!',
      'Loving the new features of this app.',
      'Had a great day today!',
    ],
  });
  const[show,setShow] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [profile, setProfile] = useState<Profile>();
  const [email, setEmail] = useState<string >('');
  useEffect( () => {
    
    const  email  = router.email;
    const encodedEmail: string | string[] = email; // Or it could be an array of strings

let decodedEmail: string;

if (Array.isArray(encodedEmail)) {
  // Handle the case where it's an array of strings
  decodedEmail = encodedEmail.map(email => decodeURIComponent(email)).join(", "); 
  setEmail(decodedEmail);
} else {
  // Handle the case where it's a single string
  decodedEmail = decodeURIComponent(encodedEmail);
}


    const user= localStorage.getItem('email');
    if(decodedEmail!==user){setShow(true);}
   
    const fetchPosts=async ()=>{
      const response = await axios.get(`http://localhost:8080/api/post/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      });
      setPosts(response.data as Post[]);
      console.log(response.data);

    }
    const fetchFollowers = async function(){
      try {
      const response = await axios.get(`http://localhost:8080/api/profile/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      });
      setFollowers(response.data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching followers:", error);
      return 0;
    }
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/public/info/${email}`
         ); // Adjust URL as per your endpoint
        setProfile(response.data as Profile);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
    const isFollowing = async function(){
      try {
      const response = await axios.get(`http://localhost:8080/api/profile/isFollowing/${user}/${router.email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      });
      
      setIsFollowing(response.data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching followers:", error);
      return 0;
    }
    }
    fetchFollowers();
    isFollowing();
    fetchPosts();
    
  }, []);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const handleFollow = async () => {
    try {
      setIsFollowing(!isFollowing);
      const user = localStorage.getItem('email');
      const response = await axios.post(
        `http://localhost:8080/api/profile/follow/${user}/${router.email}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setFollowers(response.data);
      console.log('Follow response:', response.data);
    } catch (error) {
      console.error('Error following:', error);
    }
  };
  

  const handleSendMessage =  () => {
    const  email  = router.email;
    const encodedEmail: string | string[] = email; // Or it could be an array of strings

let decodedEmail: string;

if (Array.isArray(encodedEmail)) {
  // Handle the case where it's an array of strings
  decodedEmail = encodedEmail.map(email => decodeURIComponent(email)).join(", "); 
  setEmail(decodedEmail);
} else {
  // Handle the case where it's a single string
  decodedEmail = decodeURIComponent(encodedEmail);
}

    localStorage.setItem('recipientId',decodedEmail);
    console.log(email);
    
    rou.push('/dashboard/messages')
    
  };

  return (
   
   <>
   <Navbar />
    <MDBContainer>
      <MDBRow className="justify-content-center">
        <MDBCol md="8">
          <MDBCard>
            <MDBCardBody className="text-center">
              <MDBCardImage
                src={`/images/${profile?.img}`} // Corrected template literal
                alt={user.name}
                className="rounded-circle"
                fluid
                style={{ width: '150px', height: '150px' }}
              />

              <MDBTypography tag="h3">{profile?.name} {profile?.nickname}</MDBTypography>
              <MDBTypography tag="h6">{profile?.email}</MDBTypography>
              <MDBTypography tag="h6">{followers} Followers</MDBTypography>
              { show && (
                <div>
              <MDBBtn onClick={handleFollow} color={isFollowing ? 'danger' : 'primary'} className="m-2">
                {isFollowing ? 'Unfollow' : 'Follow'}
              </MDBBtn>
              <MDBBtn onClick={handleSendMessage} color="success" className="m-2">
                Send Message
              </MDBBtn> </div>)}
            </MDBCardBody>
          </MDBCard>
          <MDBCard className="mt-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'  }}>
            <MDBCardBody>
              <MDBTypography tag="h4" className="text-center" style={{ marginBottom: '1rem' }}>Posts</MDBTypography>
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
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    
    
    </>
    
  );
};

export default ProfilePage;
