import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import axios from 'axios';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

const Writeblog = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const handleBlog = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/blogs/",
        {
          blog_title: title,
          blog_content: content,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      alert('Blog posted successfully!');
    } catch (error) {
      console.error("Error posting blog:", error.response?.data || error.message);
      alert("Failed to post blog!");
    }
  };

  const modules = {
    toolbar: {
      container: "#toolbar",
    },
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
        <nav className='flex py-3 px-6 sm:px-10 md:px-20 justify-between items-center'>
          <div className='flex items-center gap-4'>
            <img src="/LOGO.png" alt="Logo" className="h-[90px]" />
          </div>
        </nav>

        <div className="flex flex-col">
          <div className="w-full max-w-6xl mx-auto mt-6 px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div id="toolbar" className="ql-toolbar ql-snow rounded-md !border-none !shadow-none">
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
            <div>
              <button
                onClick={handleBlog}
                className="bg-[#C75C6F] text-white px-4 py-2 rounded shadow hover:bg-[#a94a5c] transition-colors duration-300"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto mt-6 px-4 border border-[#E6B655] p-6 rounded-md bg-white overflow-hidden">
        <textarea
          id='blog-title'
          name='blog-title'
          placeholder='Blog Title'
          className='font-bold text-2xl w-full resize-none overflow-hidden focus:outline-none pb-2 text-[#C75C6F]'
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
          className="bg-white text-lg mt-4 min-h-[300px]"
          placeholder="Start writing your blog content here..."
        />
      </div>
    </>
  );
};

export default Writeblog;
