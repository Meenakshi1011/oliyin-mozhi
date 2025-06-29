import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import axios from 'axios';
import ImageResize from 'quill-image-resize-module-react';
import { useParams } from 'react-router-dom';

Quill.register('modules/imageResize', ImageResize);

const Updateblog = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8000/api/blogs/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setTitle(res.data.blog_title);
        setContent(res.data.blog_content);
      } catch (error) {
        console.error("Error getting blog:", error.response?.data || error.message);
        alert("Failed to get blog!");
      }
    };
    fetchBlog();
  }, [id]);

  const handleBlogUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `http://localhost:8000/api/blogs/${id}/`,
        { blog_title: title, blog_content: content },
        { headers: { Authorization: `Token ${token}` } }
      );
      alert('Blog updated successfully!');
    } catch (error) {
      console.error("Error updating blog:", error.response?.data || error.message);
      alert("Failed to update blog!");
    }
  };

  const modules = {
    toolbar: { container: "#toolbar" },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ['Resize', 'DisplaySize'],
    },
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background',
    'align', 'link', 'image', 'video',
  ];

  return (
    <>
      <div className='sticky top-0 z-50 bg-white shadow-sm'>
        <nav className='flex py-3 px-4 md:px-12 lg:px-40 justify-between items-center'>
          <img src="/LOGO.png" alt="Logo" className="h-[90px]" />
        </nav>

        <div className="w-full max-w-5xl mx-auto mt-6 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div id="toolbar" className="ql-toolbar ql-snow rounded-md border-none shadow-none w-full md:w-auto">
            <span className="ql-formats">
              <button className="ql-bold" />
              <button className="ql-italic" />
              <button className="ql-underline" />
              <button className="ql-strike" />
            </span>
            <span className="ql-formats">
              <button className="ql-list" value="ordered" />
              <button className="ql-list" value="bullet" />
            </span>
            <span className="ql-formats">
              <select className="ql-color" />
              <select className="ql-background" />
            </span>
            <span className="ql-formats">
              <select className="ql-align" />
            </span>
            <span className="ql-formats">
              <button className="ql-link" />
              <button className="ql-image" />
              <button className="ql-video" />
            </span>
          </div>
          <button
            onClick={handleBlogUpdate}
            className="bg-[#C75C6F] hover:bg-[#a94a5c] text-white px-4 py-2 rounded shadow"
          >
            Update Now
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6 px-4 border border-[#E6B655] p-6 rounded-xl bg-white overflow-hidden">
        <textarea
          id='blog-title'
          name='blog-title'
          placeholder='Blog Title'
          className='font-bold text-2xl w-full resize-none overflow-hidden focus:outline-none pb-2'
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          rows={1}
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          id='blog-content'
          name='blog-content'
          className="bg-white text-lg md:text-xl no-border mt-4"
          placeholder="Start writing your blog content here..."
        />
      </div>
    </>
  );
};

export default Updateblog;
