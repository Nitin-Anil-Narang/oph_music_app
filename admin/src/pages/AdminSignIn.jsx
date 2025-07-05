import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axiosApi from "../conf/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../auth/AuthProvider";
import { use } from "react";

const AdminSignInForm = () => {
  const { login } = useAuth();
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (location.state?.status === "cancelled") {
//       toast.error(
//         "Payment is mandatory. Please complete the payment to continue."
//       );
//       navigate("/auth/login", { replace: true, state: {} });
//     }
//   }, [location.state, logout, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      //   const response = await loginUser(credentials.email, credentials.password);
      console.log(credentials.email, credentials.password);
      
      const response = await axiosApi.post("/admin/signin", { email:credentials.email,  password: credentials.password});
      console.log(response);
      
      
      if (response.status === 200) {
        toast.success("Login Successful");       
        localStorage.setItem("token", response.data.token);
        const token=response.data.token;
        login(token);
        console.log(response.data.token,"done");
        
        
        navigate("/home")
        // const path = `${response.step}?ophid=${response.ophid}`
        // navigate(path, {
        //   state: {
        //     from: "Registeration"
        //   }
        // });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-[url('/assets/images/music_bg.png')] bg-cover bg-center p-5">
  <div className="w-full max-w-lg p-10 rounded-xl bg-white bg-opacity-20 shadow-xl text-white">
    <h1 className="text-center text-3xl mb-5 font-extrabold">SIGN IN</h1>

    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-lg">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          placeholder="abc@gmail.com"
          required
        />
      </div>

      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 text-lg">
          Password:
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 text-base pr-12 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300"
          >
            {showPassword ? <FiEyeOff size={24} /> : <FiEye size={24} />}
          </button>
        </div>
      </div>

      <div className="text-right mb-5">
        <a
          href="#"
          className="text-cyan-400 text-sm underline hover:text-cyan-300"
          onClick={() => navigate("/auth/forgot-password")}
        >
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 text-base font-bold rounded-lg ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-cyan-400 hover:bg-cyan-500"
        } text-black transition-colors duration-200`}
      >
        {loading ? "Logging In..." : "Log In"}
      </button>
    </form>

    <p className="mt-6 text-center text-sm">
      Don&apos;t have an account?{" "}
      <a
        href="#"
        className="text-cyan-400 underline hover:text-cyan-300"
        onClick={() => navigate("/auth/signup")}
      >
        Create Account
      </a>
    </p>
  </div>
</div>

);

};

export default AdminSignInForm;
