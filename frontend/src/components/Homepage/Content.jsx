import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { stripHtml } from '../../utils/stripHtml';
import { useNavigate } from 'react-router-dom';

const extractFirstImage = (html) => {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
};

const Content = ({ search }) => {
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/allblogs/')
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.blog_title.toLowerCase().includes(search.toLowerCase()) ||
      blog.blog_content.toLowerCase().includes(search.toLowerCase()) ||
      (blog.name && blog.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDisplay = (id) => navigate(`/Displayblog/${id}`);
  const handleCreate = () => navigate('/Writeblog');

  return (
    <div className="max-w-6xl mx-auto pt-[200px] px-4 pb-16">
      {/* Tabs */}
      <div className="flex border-b border-[#E6B655] mb-6 text-center text-sm sm:text-base">
        <button
          onClick={() => setActiveTab('All')}
          className={`w-1/2 py-2 font-semibold ${
            activeTab === 'All'
              ? 'text-[#C75C6F] border-b-2 border-[#C75C6F]'
              : 'text-gray-500'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('Write a Story')}
          className={`w-1/2 py-2 font-semibold ${
            activeTab === 'Write a Story'
              ? 'text-[#C75C6F] border-b-2 border-[#C75C6F]'
              : 'text-gray-500'
          }`}
        >
          Write a Story
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'All' ? (
        filteredBlogs.length === 0 ? (
          <p className="text-gray-500 text-center italic">
            No blogs found matching your search.
          </p>
        ) : (
          <div className="grid gap-6">
            {filteredBlogs.map((blog, index) => {
              const previewText = stripHtml(blog.blog_content).substring(0, 150);
              const previewImage = extractFirstImage(blog.blog_content);

              return (
                <div
                  key={index}
                  onClick={() => handleDisplay(blog.id)}
                  className="flex flex-col md:flex-row items-start md:items-center gap-5 border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer p-4 bg-white"
                >
                  <div className="flex-1">
                    <p className="text-xl font-semibold text-gray-800 mb-1">{blog.blog_title}</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{previewText}</p>
                    <p className="text-xs italic text-gray-400 mt-2">by {blog.name || "Unknown"}</p>
                  </div>

                  <div className="w-full md:w-[150px] h-[150px] flex-shrink-0">
                    <img
                      src={previewImage || '/logo.webp'}
                      alt="blog preview"
                      className="w-full h-full object-cover rounded-md border border-gray-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center text-center mt-10 gap-6">
          <p className="text-lg sm:text-xl text-gray-700 max-w-sm">
            Don’t just consume stories. Create them...
          </p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-[#C75C6F] text-white rounded shadow hover:bg-[#a94a5c] transition-colors duration-300"
          >
            Start Writing
          </button>
        </div>
      )}
    </div>
  );
};

export default Content;
