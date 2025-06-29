import React, { useState, useRef, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Homepage = ({ search, setSearch }) => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState({});
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
      useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get("token");

      if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl); // ✅ Save token
        axios.defaults.headers.common['Authorization'] = `Token ${tokenFromUrl}`; // ✅ Set axios auth header

        // ✅ Remove ?token=... from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }, []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get("http://localhost:8000/api/auth/user/", {
        headers: { Authorization: `Token ${token}` },
      })
        .then(res => setUsername(res.data))
        .catch(console.error);

      axios.get("http://localhost:8000/api/profile/", {
        headers: { Authorization: `Token ${token}` },
      })
        .then(res => setProfile(res.data[0]))
        .catch(console.error);
    }
  }, []);

  const handleLogout = async () => {
    await axios.post("http://localhost:8000/api/auth/logout/");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = "/";
  };

  const handleProfile = () => navigate('/profile');

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#E6B655] text-white shadow-md py-3 md:py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        
        {/* Logo + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full sm:w-auto justify-center sm:justify-start">
          <img
            src="/LOGO.png"
            alt="oliyin mozhi"
            className="h-[50px] md:h-[90px] object-contain mx-auto sm:mx-0"
          />

          <div className="flex border border-[#C75C6F] rounded overflow-hidden w-full sm:w-[300px] bg-[#f8e8b1] text-black shadow-sm">
            <input
              type="text"
              placeholder="Search for blogs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-2 py-1 bg-transparent text-black placeholder:text-gray-600 focus:outline-none"
            />
            <button className="px-2 text-[#C75C6F]">
              {search === '' ? <FiSearch /> : <AiOutlineClose onClick={() => setSearch('')} />}
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 justify-center">
          <span className="text-base sm:text-xl font-medium text-[#C75C6F]">
            Hello {username.name || '...'}!
          </span>
          <div className="relative" ref={dropdownRef}>
            <div
              className="rounded-full border-2 border-[#C75C6F] h-[50px] w-[50px] sm:h-[70px] sm:w-[70px] md:h-[90px] md:w-[90px] overflow-hidden hover:cursor-pointer"
              onClick={() => setDropdown(prev => !prev)}
            >
              <img
                src={profile?.image || "/logo.webp"}
                alt="user"
                onError={(e) => (e.target.src = "/logo.webp")}
                className="h-full w-full object-cover object-center"
              />
            </div>
            {dropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white text-black border-2 border-[#C75C6F] rounded shadow-lg z-10">
                <ul className="flex flex-col">
                  <li className="px-4 py-2 hover:bg-[#f6d58f] cursor-pointer" onClick={handleProfile}>
                    View Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-[#f6d58f] cursor-pointer" onClick={handleLogout}>
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Homepage;
