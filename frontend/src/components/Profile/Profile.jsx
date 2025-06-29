import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPen } from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/profile/me/', {
        headers: { Authorization: `Token ${token}` },
      });
      setProfile(res.data);
      setDescription(res.data.description || '');
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDescriptionSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:8000/api/profile/me/',
        { description },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      await fetchProfile();
    } catch (err) {
      console.error('Error updating description', err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:8000/api/profile/me/',
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      await fetchProfile();
    } catch (err) {
      console.error('Error uploading image', err);
    }
  };

  if (!profile) {
    return <div className="text-center mt-10 text-lg">Loading profile...</div>;
  }

  return (
    <div className="flex flex-col items-center px-4 md:px-12 lg:px-40 mt-10">
      <div className="flex flex-col sm:flex-row w-full max-w-5xl gap-8 items-center bg-white p-6 rounded-xl shadow-md border border-[#E6B655]">
        <div className="relative w-[130px] h-[130px] md:w-[150px] md:h-[150px]">
          <img
            src={`${profile.image?.startsWith('http') ? profile.image : `http://localhost:8000${profile.image}`}?${new Date().getTime()}`}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-4 border-[#C75C6F]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'http://localhost:8000/media/profileimage/logo.webp';
            }}
          />
          <div
            className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <FaPen className="text-[#C75C6F] text-sm" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            hidden
          />
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <p className="text-xl font-semibold text-[#C75C6F]">{profile.name}</p>
          <p className="text-sm text-gray-600">{profile.email}</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description where others can see..."
            rows={3}
            className="border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#E6B655]"
          />
          <button
            onClick={handleDescriptionSave}
            className="self-start px-4 py-2 bg-[#C75C6F] text-white text-sm rounded hover:bg-[#a94a5c]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
