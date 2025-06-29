import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PasswordResetConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const handleSubmit = async () => {
    if (!password1 || !password2) {
      setMessage("All fields are required.");
      return;
    }

    if (password1.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password1 !== password2) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/auth/password/reset/confirm/", {
        uid,
        token,
        new_password1: password1,
        new_password2: password2,
      });

      setMessage("Password has been reset. Redirecting to login...");
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      const errors = err.response?.data;
      if (errors?.token) {
        setMessage("Invalid or expired token. Please request a new reset email.");
      } else if (errors?.new_password2) {
        setMessage(errors.new_password2.join(" "));
      } else {
        setMessage("Error resetting password. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-6">
        <img src="/LOGO.png" alt="oliyin mozhi" className="h-24 object-contain" />
      </div>

      {/* Form Card */}
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Reset Your Password</h2>

        {message && (
          <p className={`mb-4 text-sm text-center ${message.includes('reset') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-[#C75C6F] hover:bg-[#a94a5c] text-white py-2 rounded font-medium"
          >
            Set New Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
