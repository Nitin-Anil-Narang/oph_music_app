import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import axiosApi from "../../../conf/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosApi.post('/auth/forgot-password', { email });
      toast.success('Password reset instructions sent to your email');
      navigate('/auth/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div
      className="py-40 pt-48 flex items-center justify-center bg-[url('/assets/images/contact/bg.png')] bg-cover bg-center relative 
              before:content-['']
              before:absolute
              before:inset-0
              before:block
              before:bg-gradient-to-b
              before:from-[#000000]
              before:to-[#0000]
              before:opacity-75
              before:z-5"
    >
      <div className="w-full max-w-2xl p-8 rounded-lg relative z-10">
        <h1 className="text-cyan-400 text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)] text-center">
          FORGOT PASSWORD
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
        Oops! Don’t worry, it happens. You still have full control—just follow the steps to recover your portal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1 ml-4"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              placeholder="abc@gmail.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 ${
              isLoading ? 'bg-cyan-500 cursor-not-allowed' : 'bg-cyan-400 hover:bg-cyan-500'
            } text-gray-900 font-medium rounded-full transition-colors duration-200`}
          >
            {isLoading ? 'Sending...' : 'Continue'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <a
            href="#"
            className="text-cyan-400 hover:text-cyan-300"
            onClick={() => {
              navigate("/auth/signup");
            }}
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
