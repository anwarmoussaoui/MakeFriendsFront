'use client';
import React, { useState } from 'react';
import './style.css';   
import axios from 'axios';
import { Comments } from '../profile/[email]/page';



interface PostProps {
  id: number;
  email: string;
  imageUrl: string;
  countLikes: number;
  content: string;
  comments: Comments[];
}

const Post: React.FC<PostProps> = ({ id, email, imageUrl, countLikes, content, comments }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(countLikes);
  const [commentInput, setCommentInput] = useState('');
  const [commentList, setCommentList] = useState(comments);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const user = typeof window !== 'undefined' ? localStorage.getItem('email') : null;

  const handleLike = async () => {
    const response = await axios.post(
      `http://localhost:8080/api/post/likes/${id}`,
      { user },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLikes(response.data);
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.post(
      `http://localhost:8080/api/post/comment/${id}`,
      { owner: user, content: commentInput },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCommentList([...commentList, response.data]);
    setCommentInput('');
  };

  return (
    <div className="card glass w-96">
      <figure>
        {imageUrl && <img src={imageUrl} alt="post" />}
        
      </figure>
      <div className="card-body">
        <h2 className="card-title">{email}</h2>
        <p>{content}</p>
        <div className="card-actions justify-end">
          <button className="btn" onClick={handleLike}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likes}
          </button>
          <button className="btn" onClick={() => document.getElementById('my_modal_1').showModal()}>Comments</button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">{content}</h3>
              <div className="py-4">
              {commentList.map((comment: Comments) => (
  <div key={comment.id} className="comment">
    <div className="comment-header">
      <img 
        src={`/images/${comment?.ownerPic}`} 
        alt={comment.owner}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          marginRight: '10px' // Add some space between the image and the text
        }} 
      />
      <h6 className="comment-owner">{comment.owner}</h6>
    </div>
    <p className="comment-content">{comment.content}</p>
  </div>
))}

              </div>
              
              <div className="modal-action">
                <form method="dialog" onSubmit={handleCommentSubmit}>
                  <input
                    type="text"
                    name="comment"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                  <div className="button-group">
                    <button type="button" className="btn" onClick={() => document.getElementById('my_modal_1').close()}>Close</button>
                    <button type="submit" className="btn">Comment</button>
                  </div>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default Post;
