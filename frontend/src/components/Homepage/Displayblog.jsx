import React, { useEffect, useState } from 'react';
import Homepage from './Homepage';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Viewprofile from "../Viewprofile/Viewprofile";
import { useNavigate } from 'react-router-dom';

const Displayblog = () => {
  const [blog, setBlog] = useState({});
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [followed, setFollowed] = useState(false);


  useEffect(() => {
    axios.get(`http://localhost:8000/api/blogs/${id}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    })
    .then(res => setBlog(res.data))
    .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    if (blog.blog_content) {
      const iframes = document.querySelectorAll('.ql-editor iframe');
      iframes.forEach(iframe => {
        iframe.removeAttribute('style');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', 'auto');
      });
    }
  }, [blog]);

  const handleProfile = () => {
    navigate(`/Viewprofile/${blog.user_id}`)
  }


  const handleFollow = () => {
      setFollowed((prev) => !prev);
    };
  return (
    <>
      <Homepage />
      <div className='my-10 mx-4 mt-[190px] md:mx-10 lg:mx-20 xl:mx-60 border border-[#E6B655] p-6 sm:p-10 rounded-xl bg-white shadow-md'>
        <ul className='list-none flex flex-col gap-4'>
          <li>
            <p className='font-bold text-3xl sm:text-4xl text-[#C75C6F]'>{blog.blog_title}</p>
          </li>
          <li>
            <p className='italic text-sm text-gray-500'>
              {blog.created_at} | Author:{' '}
              <span
                onClick={handleProfile}
                className="text-[#C75C6F] underline cursor-pointer hover:text-[#a94a5c]"
              >
                {blog.name}
              </span>
            </p>
          </li>

          <li>
          <button 
            onClick={handleFollow}
            className={`px-4 py-2 rounded-md w-fit shadow transition-colors duration-300 
              ${followed ? 'bg-gray-400' : 'bg-[#C75C6F] hover:bg-[#a94a5c]'} text-white`}
          >
            {followed ? 'Following' : 'Follow'}
          </button>
          </li>
          <li>
            <div
              className='text-base leading-7 mt-4 ql-editor text-gray-800'
              dangerouslySetInnerHTML={{ __html: blog.blog_content }}
            />
          </li>
        </ul>
      </div>
    </>
  );
};

export default Displayblog;
