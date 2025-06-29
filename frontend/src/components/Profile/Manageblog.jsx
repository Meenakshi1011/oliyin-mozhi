import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Manageblog = () => {
  const [blog, setBlog] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/blogs/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      setBlog(null);
      navigate('/profile');
    } catch (error) {
      console.error(error);
      alert("Cannot delete blog, please try again later");
    }
  };

  const handleUpdate = () => {
    navigate(`/Updateblog/${id}`);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/blogs/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => setBlog(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    if (blog.blog_content) {
      const iframes = document.querySelectorAll('.ql-editor iframe');
      iframes.forEach((iframe) => {
        iframe.removeAttribute('style');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', 'auto');
      });
    }
  }, [blog]);

  return (
    <div className='mt-20 px-4 md:px-12 lg:px-40 flex flex-col gap-6'>
      <div className='flex flex-wrap gap-4'>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-[#C75C6F] hover:bg-[#a94a5c] text-white text-sm font-semibold rounded-lg shadow transition"
        >
          <FaTrash className="text-white text-base" />
          Delete
        </button>

        <button
          onClick={handleUpdate}
          className="flex items-center gap-2 px-4 py-2 bg-[#E6B655] hover:bg-[#d9a840] text-white text-sm font-semibold rounded-lg shadow transition"
        >
          <FaEdit className="text-white text-base" />
          Update
        </button>
      </div>

      <div className='border border-[#E6B655] p-6 rounded-xl bg-white'>
        <ul className='list-none flex flex-col gap-4'>
          <li>
            <p className='font-bold text-3xl sm:text-4xl text-[#C75C6F]'>{blog.blog_title}</p>
          </li>
          <li>
            <p className='italic text-sm text-gray-500'>
              {blog.created_at} | Author: {blog.name}
            </p>
          </li>
          <li>
            <button className='px-4 py-2 text-white italic bg-[#C75C6F] hover:bg-[#a94a5c] rounded-md w-fit'>
              Follow
            </button>
          </li>
          <li>
            <div
              className='text-base leading-7 mt-4 ql-editor'
              dangerouslySetInnerHTML={{ __html: blog.blog_content }}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Manageblog;
