'use client';
import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from './services/profileService';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

interface ProfileProps {
  email: string;
}

const Profile: React.FC<ProfileProps> = ({ email }) => {
  const route= useRouter();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile(email);
        setName(profile.name);
        setNickname(profile.nickName);
        setProfileImage(profile.pricture);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [email]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Set the preview image URL
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (file) {
      try {
        const success = await updateProfile(email, name, nickname, file);
        if (success) {
          Swal.fire('Profile updated successfully');
          route.push("/dashboard");
        } else {
          Swal.fire('Failed to update profile');
        }
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    } else {
      Swal.fire('Please select a profile image');
    }
  };

  return (
    <div className="container mx-auto p-4">
    <div className="flex flex-col items-center mb-4">
      {profileImage && !previewImage && (
        <img src={`images/${profileImage}`} alt="Profile" className="rounded-full w-32 h-32 mb-4" />
      )}
      {previewImage && (
        <img src={previewImage} alt="Selected Profile" className="rounded-full w-32 h-32 mb-4" />
      )}
      <label className="file-input-label">
              <span className="btn btn-secondary">Choose File</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full hidden"
              />
            </label>
    </div>
    <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Name:</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Nickname:</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
      </div>
      <div className="form-control">
        
      </div>
      <button type="submit" className="btn btn-primary btn-sm mt-4">Save</button>
    </form>
  </div>
  );
};

export default Profile;
