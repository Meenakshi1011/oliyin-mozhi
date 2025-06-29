import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { stripHtml } from "../../utils/stripHtml";
import { useNavigate } from 'react-router-dom';

const extractFirstImage = (html) => {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
};

const Usercontent = () => {
  const [blogs, setBlogs] = useState(null);
  const [activeTab, setActiveTab] = useState('Manage Your Stories');
  const tabs = ['Manage Your Stories', 'Write a Story'];
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/api/userblogs/', {
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDisplay = (id) => {
    navigate(`/Manageblog/${id}`);
  };

  const handleCreate = () => {
    navigate('/Writeblog');
  };

  return (
    <div className='h-full rounded mx-auto max-w-5xl my-32 px-4'>
      {/* Tabs */}
      <div className='relative flex justify-center mb-6 border-b'>
        <div
          className={`absolute bottom-0 h-0.5 w-1/2 bg-[#C75C6F] transition-all duration-300 ${
            activeTab === 'Manage Your Stories' ? 'left-0' : 'left-1/2'
          }`}
        />
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className='w-1/2 text-center py-2 cursor-pointer z-10'
          >
            <span
              className={`transition-colors duration-300 ${
                activeTab === tab ? 'text-[#C75C6F] font-semibold' : 'text-gray-500'
              }`}
            >
              {tab}
            </span>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className='mt-8'>
        {activeTab === 'Manage Your Stories' ? (
          <div className='flex flex-col gap-6'>
            {blogs?.blogs?.length > 0 ? (
              blogs.blogs.map((blog, index) => {
                const previewText = stripHtml(blog.blog_content).substring(0, 150);
                const previewImage = extractFirstImage(blog.blog_content);

                return (
                  <div
                    key={index}
                    onClick={() => handleDisplay(blog.id)}
                    className='w-full h-[180px] border border-[#E6B655] flex flex-row p-3 gap-[30px] rounded-md cursor-pointer hover:shadow-md transition'
                  >
                    <div className='flex flex-col flex-1'>
                      <ul className='list-none flex flex-col justify-center gap-3'>
                        <li><p className='font-bold text-lg'>{blog.blog_title}</p></li>
                        <li><p className='text-sm line-clamp-3'>{previewText}</p></li>
                        <li>
                          <p className='italic text-sm text-gray-500'>
                            {blog.name || "Unknown"}
                          </p>
                        </li>
                      </ul>
                    </div>
                    <div className='flex items-center justify-center'>
                      <img
                        src={previewImage || "/logo.webp"}
                        alt="blog preview"
                        className='w-[150px] h-[150px] object-cover rounded-md border'
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className='text-center text-gray-500 italic'>No blogs found.</p>
            )}
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center gap-6'>
            <p className='text-xl font-medium text-gray-800 text-center'>
              Don’t just consume stories. Create them...
            </p>
            <button
              onClick={handleCreate}
              className='px-6 py-2 bg-[#C75C6F] hover:bg-[#a94a5c] text-white text-sm font-medium rounded shadow'
            >
              Start Writing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Usercontent;
