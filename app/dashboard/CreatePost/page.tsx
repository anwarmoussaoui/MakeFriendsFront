'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(localStorage.getItem('email'));
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setImage(file);
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    } else {
      setImageUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email || !content || !image) {
      alert('Please fill all the fields');
      return;
    }
  
    const formData = new FormData();
    formData.append('content', content);
    formData.append('file', image);
    formData.append('email', email);
  
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
    try {
      const response = await axios.post('http://localhost:8080/api/post/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
  
      if (response.status === 200) {
        Swal.fire('Post created successfully:', response.data);
        // Optionally reset form fields or handle success feedback
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            {email && <h2 className="card-title">{email}</h2>}
            <input
              placeholder='What is on your mind?'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className='input input-bordered'
            />
          </div>
          <input
            id="file-input"
            type="file"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input" className="btn">
            Choose File
          </label>
          {imageUrl && (
            <figure>
              <img src={imageUrl} alt="Preview" />
            </figure>
          )}
          <button className="btn" type='submit'>Post</button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
