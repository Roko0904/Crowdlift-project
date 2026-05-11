 
import { useState } from "react";
import { FiMenu, FiX, FiLogOut, FiGrid } from "react-icons/fi";

function Navbar({ navigate, activePage, user, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => navigate("home")} className="text-xl font-bold text-white tracking-tight">
          CrowdLift
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            {label: "Home", page:"home"},
            { label: "Explore", page: "explore" },
            { label: "Start a Campaign", page: "campaign" },
            { label: "About", page: "about" },
          ].map((item) => (
            <button key={item.page} onClick={() => navigate(item.page)}
              className={`text-sm transition-colors ${
                activePage === item.page
                  ? "text-white border-b-2 border-purple-500 pb-0.5"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            // ---- Logged In ----
            <div className="relative">
              {/* User Avatar Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-purple-500/40 rounded-xl px-3 py-2 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm text-white font-medium">{user.name}</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-12 bg-[#0d1117] border border-white/10 rounded-xl p-2 w-48 shadow-2xl z-50">
                  {/* Email */}
                  <p className="text-xs text-gray-500 px-3 py-2 border-b border-white/5 mb-1 truncate">
                    {user.email}
                  </p>

                  {/* Dashboard Link */}
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("dashboard"); }}
                    className="w-full flex items-center gap-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors"
                  >
                    <FiGrid size={14} /> Dashboard
                  </button>

                  {/* Logout */}
                  <button
                    onClick={() => { setDropdownOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-2 text-sm text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ---- Not Logged In ----
            <>
              <button onClick={() => navigate("login")}
                className="text-sm text-gray-300 hover:text-white transition-colors">
                Login
              </button>
              <button onClick={() => navigate("signup")}
                className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1117] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {[
            {label: "Home", page:"home"},
            { label: "Explore", page: "explore" },
            { label: "Start a Campaign", page: "campaign" },
            { label: "About", page: "about" },
          ].map((item) => (
            <button key={item.page}
              onClick={() => { navigate(item.page); setMenuOpen(false); }}
              className="text-left text-gray-300 hover:text-white text-sm">
              {item.label}
            </button>
          ))}

          {user ? (
            <>
              <button
                onClick={() => { navigate("dashboard"); setMenuOpen(false); }}
                className="text-left text-gray-300 hover:text-white text-sm flex items-center gap-2"
              >
                <FiGrid size={14} /> Dashboard
              </button>
              <p className="text-sm text-gray-500">👤 {user.name}</p>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="text-left text-red-400 text-sm flex items-center gap-2"
              >
                <FiLogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { navigate("login"); setMenuOpen(false); }}
                className="text-left text-gray-300 hover:text-white text-sm">Login</button>
              <button onClick={() => { navigate("signup"); setMenuOpen(false); }}
                className="text-left text-gray-300 hover:text-white text-sm">Sign Up</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;