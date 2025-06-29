import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { stripHtml } from "../../utils/stripHtml";
import { useNavigate, useParams } from 'react-router-dom';

const extractFirstImage = (html) => {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
};

const ViewUserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const { user_id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/public-profile/${user_id}/`)
      .then(res => setBlogs(res.data.blogs || []))
      .catch(err => console.error(err));
  }, [user_id]);

  const handleDisplay = (id) => {
    navigate(`/Displayblog/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto my-16 px-4">
      <h2 className="text-2xl font-bold text-[#C75C6F] mb-8 border-b border-[#E6B655] pb-2">
        More Stories by this Author
      </h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500 text-center italic">This author hasn't written any blogs yet.</p>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog, index) => {
            const previewText = stripHtml(blog.blog_content).substring(0, 150);
            const previewImage = extractFirstImage(blog.blog_content);

            return (
              <div
                key={index}
                onClick={() => handleDisplay(blog.id)}
                className="flex flex-col md:flex-row items-start md:items-center gap-5 border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer p-4 bg-white"
              >
                {/* Blog Info */}
                <div className="flex-1">
                  <p className="text-xl font-semibold text-gray-800 mb-1">{blog.blog_title}</p>
                  <p className="text-sm text-gray-600 line-clamp-3">{previewText}</p>
                  <p className="text-xs italic text-gray-400 mt-2">by {blog.name || "Unknown"}</p>
                </div>

                {/* Thumbnail */}
                <div className="w-full md:w-[150px] h-[150px] flex-shrink-0">
                  <img
                    src={previewImage || "/logo.webp"}
                    alt="blog preview"
                    className="w-full h-full object-cover rounded-md border border-gray-300"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewUserBlogs;
