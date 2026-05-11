 import { useState } from "react";
import { FiArrowRight, FiGlobe, FiMail } from "react-icons/fi";

function Footer({ navigate }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Newsletter subscribe
  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
      alert("Valid email enter karo!");
      return;
    }
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-[#070b0f] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <button
              onClick={() => navigate("home")}
              className="text-lg font-bold text-white mb-2 hover:text-purple-400 transition-colors"
            >
              CrowdLift
            </button>
            <p className="text-xs text-gray-500 leading-relaxed mt-2">
              The Architectural Curator for the world's most innovative ideas.
            </p>
            <div className="text-xs flex gap-3 mt-4 text-gray-500">
             © 2024 CrowdLift. The Visionary Ledger.
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Platform
            </p>
            {[
              { label: "Explore", page: "explore" },
              { label: "Start Campaign", page: "campaign" },
              { label: "About", page: "about" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.page)}
                className="block text-sm text-gray-500 hover:text-white cursor-pointer mb-2 transition-colors text-left"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Company Links */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Company
            </p>
            {[
              { label: "About Us", page: "about" },
              { label: "Login", page: "login" },
              { label: "Sign Up", page: "signup" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.page)}
                className="block text-sm text-gray-500 hover:text-white cursor-pointer mb-2 transition-colors text-left"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Newsletter
            </p>
            {subscribed ? (
              <p className="text-green-400 text-sm font-semibold">✓ Subscribed!</p>
            ) : (
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  className="flex-1 bg-white/5 border border-white/10 rounded-l-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/50 transition-colors"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-purple-600 hover:bg-purple-700 px-3 rounded-r-lg transition-colors"
                >
                  <FiArrowRight className="text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

      
      </div>
    </footer>
  );
}

export default Footer;