import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Viewprofile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user_id } = useParams();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8000/api/public-profile/${user_id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-gray-500 text-lg italic">Loading profile...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-red-500 font-semibold">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col md:flex-row items-center md:items-start max-w-4xl mt-16 mb-16 gap-8 w-full px-4">
        {/* Profile Image */}
        <div className="relative w-[150px] h-[150px] shrink-0">
          <img
            src={
              data.image?.startsWith('http')
                ? data.image
                : `http://localhost:8000${data.image}`
            }
            alt="Profile"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/logo.webp';
            }}
            className="w-full h-full object-cover rounded-full border border-[#E6B655]"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3 flex-1">
          <p className="text-2xl font-semibold text-[#C75C6F]">{data.name || "Unknown User"}</p>
          <p className="text-sm text-gray-600">{data.email || "No email provided"}</p>
          <textarea
            value={data.description || "No description provided."}
            readOnly
            rows={3}
            className="border border-gray-300 p-3 rounded text-sm resize-none bg-gray-50 text-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default Viewprofile;
