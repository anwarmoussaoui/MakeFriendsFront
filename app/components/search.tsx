'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  profileImage: string;
  // Add other properties if needed
}

interface SearchDropdownProps {
  placeholder: string;
  searchUrl: string;
  onSelect: (email: string) => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ placeholder, searchUrl, onSelect }) => {
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(searchUrl, {
        params: { email },
      });
      setUsers(response.data);
      console.log(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching users by email:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      handleSearch();
    } else {
      setUsers([]);
      setShowDropdown(false);
    }
  }, [email]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className="input input-bordered w-full max-w-md"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {loading && <div className="loading-indicator">Loading...</div>}
      {showDropdown && (
        <div className="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-4 shadow absolute">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
              onMouseDown={() => { onSelect(user.email); setShowDropdown(false); setEmail(''); }}
            >
              
                  <div style={{ display: 'flex', alignItems: 'center'}}> <img src={`images/` + user.profileImage} style={ {
   width: '40px',
   height: '40px',
   borderRadius: '50%',
 }} />
                {user.email}</div>
              
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
