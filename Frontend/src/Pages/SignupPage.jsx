import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authAPI, saveToken } from "../services/api";
import { GoogleLogin } from '@react-oauth/google';

function SignUpPage({ navigate, handleLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); 
  const [agreed, setAgreed] = useState(false);  


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
            
            navigate("home");
          } else {
            alert("GitHub Signup Failed: " + data.message);
          }
        } catch (error) {
          console.error("GitHub auth error:", error);
        }
      };

      authenticateGithub();
    }
  }, [handleLogin, navigate]);


  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // Email/Password Signup
  const handleSignUp = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all fields!");
      return;
    }
    if (!agreed) {
      alert("Please agree to the Terms of Service!");
      return;
    }

    const data = await authAPI.register(form.name, form.email, form.password);
    if (data.success) {
      saveToken(data.token);
      handleLogin(data.user);
      navigate("home");
    } else {
      alert(data.message);
    }
  };

  // Google Signup/Login Handler
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
        navigate("home");
      } else {
        alert("Google Error: " + data.message);
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
      <Navbar navigate={navigate} activePage="signup" user={null} handleLogout={() => {}} />

      <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10">
 
          <div className="hidden md:flex flex-col justify-between p-10 w-2/5 bg-gradient-to-br from-purple-600 to-blue-700">
            <p className="text-xl font-bold text-white">CrowdLift</p>

            <div>
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold uppercase">
                The Curator's Choice
              </span>
              <h2 className="text-4xl font-black text-white mt-6 leading-tight">
                Fuel the next architectural masterpiece.
              </h2>
              <p className="text-white/60 mt-4 text-sm leading-relaxed">
                Join a community of 50,000+ visionaries funding the future of sustainable design and
                urban innovation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex">
                {["JV", "ET", "MC"].map((initials) => (
                  <div
                    key={initials}
                    className="w-8 h-8 rounded-full bg-white/20 border-2 border-purple-600 flex items-center justify-center text-xs font-bold text-white -ml-2 first:ml-0"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-xs">Curated by global leads</p>
            </div>
          </div>

          <div className="flex-1 bg-[#0d1117] p-10">
            <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
            <p className="text-sm text-gray-500 mb-8">
              Start your journey as an architectural curator today.
            </p>

            {/* UPDATED Social Auth Buttons */}
            <div className="flex gap-3 mb-8 items-center h-[42px]">
              <div className="flex-1 flex justify-center rounded-xl overflow-hidden">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log('Google Signup Failed')}
                  theme="filled_black"
                  shape="rectangular"
                  text="signup_with"
                />
              </div>
              <button 
                onClick={loginWithGithub}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-[10px] text-sm text-white transition-colors h-full"
              >
                <FaGithub size={18} /> GitHub
              </button>
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-600 uppercase tracking-widest">Or Continue With</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Full Name Input */}
            <div className="mb-4">
              <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Alex Sterling"
                value={form.name}
                onChange={handleChange("name")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
              />
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="alex@curated.com"
                value={form.email}
                onChange={handleChange("email")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-purple-500"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                I agree to the{" "}
                <span className="text-purple-400 cursor-pointer hover:underline">Terms of Service</span>{" "}
                and acknowledge the{" "}
                <span className="text-purple-400 cursor-pointer hover:underline">Privacy Policy</span>.
              </label>
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleSignUp}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] mb-4"
            >
              Create Account
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("login")}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>

      <Footer navigate={navigate} />
    </div>
  );
}

export default SignUpPage;