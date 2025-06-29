import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import CircularText from "../../Reactbits/CircularText/CircularText";
import { SiGoogle } from 'react-icons/si';

const Signin = () => {
  const [activeTab, setActiveTab] = useState('signup');
  const [show, setShow] = useState({ password: false, repassword: false });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const toggleIcon = (field) => {
    setShow(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const clearAllErrors = () => {
    setError('');
    setErrors('');
    setSuccessMessage('');
  };

  const handleReset = async () => {
    const email = document.getElementById('email').value;
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/auth/password/reset/", { email });
      alert("Reset email sent. Please check your inbox.");
    } catch {
      alert("Error sending reset email. Try again.");
    }
  };

  const handleSignup = async () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const repassword = document.getElementById("repassword").value;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!name || !email || !password || !repassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== repassword) {
      setErrors("Passwords do not match.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrors("Password must be at least 8 characters, include 1 uppercase and 1 special character.");
      return;
    }

    clearAllErrors();

    try {
      // Show success message regardless of backend response
      setSuccessMessage("Check your mail. Email verification required.");

      await axios.post("http://localhost:8000/api/auth/registration/", {
        email,
        name,
        password1: password,
        password2: repassword
      });

      // Clear inputs
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      document.getElementById("repassword").value = "";

    } catch (error) {
      // Even if error, still show success message
      console.log("Signup error (ignored):", error.response?.data);
      setSuccessMessage("Check your mail. Email verification required.");
    }

    // After 2 minutes, replace success with error if not verified
    setTimeout(() => {
      setSuccessMessage('');
      setError("❌ Email not verified yet. Please check your inbox or try again.");
    }, 120000);
  };

  const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    clearAllErrors();

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login/", { email, password });
      const token = response.data.key;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      window.location.href = "/home";
    } catch (error) {
      if (error.response?.data?.non_field_errors) {
        setError(error.response.data.non_field_errors[0]);
      } else {
        setError("Invalid credentials.");
      }
    }
  };

  return (
    <div className='min-h-screen flex flex-col lg:flex-row'>
      <div className='lg:w-[40%] w-full bg-white flex flex-col items-center justify-center pt-10 pb-6 px-4'>
        <div className='relative h-[160px] w-[160px] flex items-center justify-center mb-6 mt-6'>
          <CircularText
            text="OLIYIN.MOZHI."
            onHover="speedUp"
            spinDuration={20}
            className="absolute top-0 left-0 h-full w-full font-bold"
          />
          <div className='rounded-full overflow-hidden border-2 border-[#E6B655] p-1 bg-[#f0f0f0] z-10'>
            <img src="/crane.avif" alt="crane" className='object-cover w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full' />
          </div>
        </div>
      </div>

      <div className='lg:w-[60%] w-full bg-[#E6B655] flex flex-col items-center justify-center py-10 px-4'>
        <div className='w-full max-w-[400px] rounded-xl shadow-xl bg-white px-6 py-6'>
          <p className='text-red-500 text-sm text-center min-h-[20px] mb-2'>{error}</p>
          <p className='text-red-500 text-sm text-center min-h-[20px] mb-2'>{errors}</p>
          {successMessage && (
            <p className='text-green-600 text-sm text-center mb-2'>{successMessage}</p>
          )}

          {/* Tabs */}
          <div className='flex relative mb-4'>
            <div className={`absolute bottom-0 left-0 h-1 bg-[#C75C6F] transition-all duration-300 ${
              activeTab === 'signup' ? 'w-1/2 translate-x-0' : 'w-1/2 translate-x-full'
            }`} />
            <div onClick={() => { setActiveTab('signup'); clearAllErrors(); }}
              className='flex w-1/2 justify-center py-2 cursor-pointer z-10 text-[#C75C6F] font-semibold'>
              Signup
            </div>
            <div onClick={() => { setActiveTab('login'); clearAllErrors(); }}
              className='flex w-1/2 justify-center py-2 cursor-pointer z-10 text-[#C75C6F] font-semibold'>
              Login
            </div>
          </div>

          <div className='flex-1'>
            {activeTab === 'signup' ? (
              <>
                <div className='flex flex-col gap-4 items-center'>
                  <input id='name' type='text' placeholder='Enter Your Name' onFocus={clearAllErrors}
                    className='p-2 border border-[#C75C6F] rounded w-full' />
                  <input id='email' type='email' placeholder='Enter Your Email' onFocus={clearAllErrors}
                    className='p-2 border border-[#C75C6F] rounded w-full' />
                  <div className='relative w-full'>
                    <input id='password' type={show.password ? 'text' : 'password'} placeholder='Enter Your Password'
                      onFocus={clearAllErrors} className='p-2 border border-[#C75C6F] rounded w-full pr-10' />
                    <span onClick={() => toggleIcon('password')}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#C75C6F]'>
                      {show.password ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                  <div className='relative w-full'>
                    <input id='repassword' type={show.repassword ? 'text' : 'password'} placeholder='Re-Enter Your Password'
                      onFocus={clearAllErrors} className='p-2 border border-[#C75C6F] rounded w-full pr-10' />
                    <span onClick={() => toggleIcon('repassword')}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#C75C6F]'>
                      {show.repassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                  <button onClick={handleSignup}
                    className='p-2 bg-[#C75C6F] text-white font-semibold rounded-xl w-1/2'>
                    Signin
                  </button>
                  <hr className='border border-gray-300 w-full mt-2' />
                </div>
                <div className='flex flex-col items-center mt-3'>
                  <span className='text-gray-600'>or</span>
                  <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=961330799425-kevtpapu412t54sfc1uj54djn4l1qcf5.apps.googleusercontent.com&redirect_uri=http://localhost:8000/api/v1/auth/google/callback/&response_type=code&scope=email profile openid"
                    className='text-blue-700 mt-1 underline'>
                    <SiGoogle size={20} color="#65000B" />
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className='flex flex-col gap-4 items-center'>
                  <input id='email' type='email' placeholder='Enter Your Email' onFocus={clearAllErrors}
                    className='p-2 border border-[#C75C6F] rounded w-full' />
                  <div className='relative w-full'>
                    <input id='password' type={show.password ? 'text' : 'password'} placeholder='Enter Your Password'
                      onFocus={clearAllErrors} className='p-2 border border-[#C75C6F] rounded w-full pr-10' />
                    <span onClick={() => toggleIcon('password')}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#C75C6F]'>
                      {show.password ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                  <span className='text-red-500 text-sm text-left w-full'>{errors}</span>
                  <p onClick={handleReset} className='cursor-pointer text-sm text-blue-700 hover:underline'>Forgot password?</p>
                  <button onClick={handleLogin}
                    className='p-2 bg-[#C75C6F] text-white font-semibold rounded-xl w-1/2'>
                    Login
                  </button>
                  <hr className='border border-gray-300 w-full mt-2' />
                </div>
                <div className='flex flex-col items-center mt-3'>
                  <span className='text-gray-600'>or</span>
                  <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=961330799425-kevtpapu412t54sfc1uj54djn4l1qcf5.apps.googleusercontent.com&redirect_uri=http://localhost:8000/api/v1/auth/google/callback/&response_type=code&scope=email profile openid"
                    className='text-blue-700 mt-1 underline'>
                    <SiGoogle size={20} color="#65000B" />
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-base italic text-white">
            <span className="font-semibold">Code Sonnets</span> by <a
              href="https://meenakshi-diez.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#C75C6F]">
              Meenakshi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
