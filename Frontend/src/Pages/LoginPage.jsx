import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaGithub, FaRocket } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authAPI, saveToken } from "../services/api";
import { GoogleLogin } from '@react-oauth/google';

function LoginPage({ navigate, handleLogin, fromPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);  

 
  const GITHUB_CLIENT_ID = "YOUR_GITHUB_CLIENT_ID";

 
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const githubCode = urlParams.get("code");

    if (githubCode) {
      const authenticateGithub = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/auth/github", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: githubCode }),
          });

          const data = await response.json();

          if (data.success) {
            saveToken(data.token);
            handleLogin(data.user);
            
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            navigate(fromPage || "home");
          } else {
            alert("GitHub Login Failed: " + data.message);
          }
        } catch (error) {
          console.error("GitHub auth error:", error);
        }
      };

      authenticateGithub();
    }
  }, [handleLogin, navigate, fromPage]);


  // Email/Password Login
  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }
    const data = await authAPI.login(email, password);
    if (data.success) {
      saveToken(data.token);
      handleLogin(data.user);  
      navigate(fromPage || "home");
    } else {
      alert(data.message);
    }
  };

  // Google Login Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;

      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await response.json();

      if (data.success) {
        saveToken(data.token);
        handleLogin(data.user);
        navigate(fromPage || "home");
      } else {
        alert("Google Login Failed: " + data.message);
      }
    } catch (error) {
      console.error("Google auth error:", error);
    }
  };

  // GitHub Login Handler
  const loginWithGithub = () => {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`);
  };

  return (
    <div>
      <Navbar navigate={navigate} activePage="login" user={null} handleLogout={() => {}} />

      <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="bg-white/3 border border-white/10 rounded-2xl p-8 w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <FaRocket className="text-pink-500 text-3xl mx-auto mb-3" />
            <p className="text-xl font-bold text-white">CrowdLift</p>
            <p className="text-xs text-gray-500 mt-1">Empowering the Architectural Curator</p>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Enter your credentials to access your curator dashboard.
          </p>

          <div className="mb-4">
            <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="curator@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-purple-400 uppercase tracking-widest">Password</label>
              <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] mb-6"
          >
            Sign In
          </button>

          {/* OR Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600 uppercase tracking-widest">Or Continue With</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* UPDATED Social Login Buttons */}
          <div className="flex gap-3 mb-8 items-center h-[42px]">
            <div className="flex-1 flex justify-center rounded-xl overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Google Login Failed')}
                theme="filled_black"
                shape="rectangular"
                text="continue_with"
              />
            </div>
            <button 
              onClick={loginWithGithub}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-[10px] text-sm text-white transition-colors h-full"
            >
              <FaGithub size={18} /> GitHub
            </button>
          </div>

          {/* Link to Sign Up */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("signup")}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      <Footer navigate={navigate} />
    </div>
  );
}

export default LoginPage;