import { useState, useEffect, useCallback } from "react";
import {
  FiGrid, FiTarget, FiHeart, FiMessageSquare, FiSettings,
  FiTrendingUp, FiArrowRight, FiClock, FiX, FiZap
} from "react-icons/fi";
import { BiDollar } from "react-icons/bi";
import { FaRocket } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { campaignAPI, authAPI } from "../services/api";

 
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

 
function buildActivityFromCampaigns(campaigns) {
  const events = [];

  campaigns.forEach((c) => {
    if (c.createdAt) {
      events.push({
        id: `created-${c._id}`,
        type: "project",
        icon: <FiTarget size={18} />,
        iconBg: "bg-purple-500/20 text-purple-400",
        title: "Campaign Created",
        desc: `"${c.title}" is now live!`,
        time: timeAgo(c.createdAt),
        rawDate: new Date(c.createdAt),
        tag: "PROJECT UPDATE",
        tagColor: "bg-blue-500/20 text-blue-400",
        detail: {
          heading: c.title,
          status: c.status,
          goal: c.goalAmount,
          raised: c.raisedAmount,
          deadline: c.deadline
            ? new Date(c.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
            : "No deadline",
          desc: c.description,
          createdAt: new Date(c.createdAt).toLocaleString("en-IN"),
        },
      });
    }

    if (c.updatedAt && c.createdAt && new Date(c.updatedAt) - new Date(c.createdAt) > 60000) {
      events.push({
        id: `updated-${c._id}`,
        type: "project",
        icon: <FiZap size={18} />,
        iconBg: "bg-yellow-500/20 text-yellow-400",
        title: "Campaign Updated",
        desc: `"${c.title}" was updated.`,
        time: timeAgo(c.updatedAt),
        rawDate: new Date(c.updatedAt),
        tag: "PROJECT UPDATE",
        tagColor: "bg-blue-500/20 text-blue-400",
        detail: {
          heading: c.title,
          status: c.status,
          goal: c.goalAmount,
          raised: c.raisedAmount,
          deadline: c.deadline
            ? new Date(c.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
            : "No deadline",
          desc: c.description,
          createdAt: new Date(c.updatedAt).toLocaleString("en-IN"),
        },
      });
    }

    if (c.raisedAmount > 0) {
      events.push({
        id: `donation-${c._id}`,
        type: "financial",
        icon: <FiHeart size={18} />,
        iconBg: "bg-red-500/20 text-red-400",
        title: "Donation Received",
        desc: `₹${c.raisedAmount.toLocaleString()} raised for "${c.title}"`,
        time: timeAgo(c.updatedAt || c.createdAt),
        rawDate: new Date(c.updatedAt || c.createdAt),
        tag: "FINANCIAL",
        tagColor: "bg-green-500/20 text-green-400",
        detail: {
          heading: `Donations for "${c.title}"`,
          status: c.status,
          goal: c.goalAmount,
          raised: c.raisedAmount,
          deadline: c.deadline
            ? new Date(c.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
            : "No deadline",
          desc: c.description,
          createdAt: new Date(c.updatedAt || c.createdAt).toLocaleString("en-IN"),
        },
      });
    }
  });

  events.sort((a, b) => b.rawDate - a.rawDate);
  return events;
}

 
function DetailModal({ item, onClose }) {
  if (!item) return null;
  const d = item.detail;
  const percent = d.goal ? Math.round((d.raised / d.goal) * 100) : 0;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#13151a] border border-white/10 rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.iconBg}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-white font-bold text-sm">{item.title}</p>
              <p className="text-gray-500 text-xs">{item.time}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <FiX size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div>
            <p className="text-white font-bold text-lg">{d.heading}</p>
            {d.desc && <p className="text-gray-500 text-sm mt-1 leading-relaxed line-clamp-3">{d.desc}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/3 rounded-xl p-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</p>
              <span className={`text-xs font-bold uppercase px-2 py-1 rounded-md ${
                d.status === "active" ? "bg-green-500/20 text-green-400"
                : d.status === "funded" ? "bg-purple-500/20 text-purple-400"
                : "bg-gray-500/20 text-gray-400"
              }`}>
                {d.status || "—"}
              </span>
            </div>
            <div className="bg-white/3 rounded-xl p-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Deadline</p>
              <p className="text-white text-xs font-semibold">{d.deadline}</p>
            </div>
            <div className="bg-white/3 rounded-xl p-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Raised</p>
              <p className="text-green-400 text-sm font-bold">₹{(d.raised || 0).toLocaleString()}</p>
            </div>
            <div className="bg-white/3 rounded-xl p-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Goal</p>
              <p className="text-white text-sm font-bold">₹{(d.goal || 0).toLocaleString()}</p>
            </div>
          </div>

          {d.goal > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Progress</span>
                <span className={`font-bold ${percent >= 100 ? "text-green-400" : "text-purple-400"}`}>{percent}%</span>
              </div>
              <div className="bg-white/10 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${percent >= 100 ? "bg-green-500" : "bg-purple-500"}`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-xs text-gray-600">Event at: {d.createdAt}</p>
        </div>
      </div>
    </div>
  );
}

 
function DashboardPage({ navigate, user, handleLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [myDonations, setMyDonations] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [, forceUpdate] = useState(0);

  // FETCH DATA UPDATED: Created aur Backed dono mila ke activity banayega
  const fetchData = useCallback(async () => {
    try {
      let created = [];
      let backed = [];

       
      const campData = await campaignAPI.getMy();
      if (campData.success) {
        created = campData.campaigns;
        setMyCampaigns(created);
      }

  
      if (authAPI && authAPI.getMe) {
        const userData = await authAPI.getMe();
        if (userData.success && userData.user.backedCampaigns) {
          backed = userData.user.backedCampaigns;
          setMyDonations(backed);
        }
      }

       
      const combinedCampaigns = [...created];
      backed.forEach((b) => {
        // Prevent duplicates
        if (!combinedCampaigns.find((c) => c._id === b._id)) {
          combinedCampaigns.push(b);
        }
      });

      setActivity(buildActivityFromCampaigns(combinedCampaigns));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    const tick = setInterval(() => forceUpdate((n) => n + 1), 60000);
    return () => clearInterval(tick);
  }, []);

  // DASHBOARD STATS
  const totalRaised = myCampaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
  const supportedCount = myDonations.length; // Nava stat
  const createdCount = myCampaigns.length;

  const recentActivity = activity.slice(0, 3);
  const filteredHistory = historyFilter === "all"
    ? activity
    : activity.filter((a) => a.type === historyFilter);

  const navItems = [
    { id: "dashboard", label: "Dashboard Home", icon: <FiGrid size={18} /> },
    { id: "campaigns", label: "My Campaigns", icon: <FaRocket size={16} /> },
    { id: "donations", label: "My Donations", icon: <FiHeart size={18} /> },
    { id: "messages", label: "Messages", icon: <FiMessageSquare size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar navigate={navigate} activePage="dashboard" user={user} handleLogout={handleLogout} />

      <div className="flex min-h-screen pt-16">

        {/* ---- SIDEBAR ---- */}
        <div className="hidden md:flex flex-col w-56 bg-[#080c10] border-r border-white/5 fixed left-0 top-16 bottom-0 p-6">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-4">Navigation</p>
          <div className="flex flex-col gap-1 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all text-sm ${
                  activeNav === item.id
                    ? "bg-purple-600/20 border border-purple-500/20 text-white font-semibold"
                    : "text-gray-500 hover:text-white hover:bg-white/3"
                }`}
              >
                <span className={activeNav === item.id ? "text-purple-400" : ""}>{item.icon}</span>
                {item.label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={() => setActiveNav("settings")}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all text-sm ${
                activeNav === "settings" ? "bg-white/5 text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              <FiSettings size={18} /> Settings
            </button>
          </div>
          <div className="mt-4 bg-white/3 border border-white/8 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Visionary Member</p>
            </div>
          </div>
        </div>

        {/* ---- MAIN ---- */}
        <div className="flex-1 md:ml-56 p-8">

          {activeNav === "dashboard" && (
            <div>
              <div className="mb-10">
                <p className="text-xs text-purple-400 uppercase tracking-widest mb-3">The Visionary Ledger</p>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Welcome back, {user?.name?.split(" ")[0] || "Curator"}.
                </h1>
                {/* Updated Text */}
                <p className="text-gray-400 max-w-xl leading-relaxed">
                  You have created <span className="text-white font-semibold">{createdCount} campaigns</span> and supported <span className="text-white font-semibold">{supportedCount} projects</span>.
                  Keep building the future of sustainable design.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 flex justify-between items-start hover:border-purple-500/20 transition-colors">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Total Raised</p>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-black text-white">₹{totalRaised.toLocaleString()}</p>
                      {totalRaised > 0 && <span className="text-xs text-green-400 font-semibold mb-1">Live</span>}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                    <FiTrendingUp size={20} />
                  </div>
                </div>

                {/* UPDATED: Projects Supported Card */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 flex justify-between items-start hover:border-purple-500/20 transition-colors">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Projects Supported</p>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-black text-white">{String(supportedCount).padStart(2, "0")}</p>
                      <span className="text-xs text-gray-500 mb-1">Backed</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <FiHeart size={20} />
                  </div>
                </div>

                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 flex justify-between items-start hover:border-purple-500/20 transition-colors">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Total Campaigns</p>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-black text-white">{createdCount}</p>
                      <span className="text-xs text-gray-500 mb-1">Created</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <BiDollar size={22} />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      Recent Activity
                    </h2>
                    <p className="text-sm text-gray-500">Real-time updates from your ledger and followed campaigns.</p>
                  </div>
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="text-xs text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors"
                  >
                    View Full History
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-10">
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl">
                    <FiZap className="text-gray-700 mx-auto mb-3" size={32} />
                    <p className="text-white font-bold mb-1">No activity yet</p>
                    <p className="text-gray-500 text-sm">Create or back a campaign to see activity here.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {recentActivity.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedActivity(item)}
                        className="bg-white/3 border border-white/8 rounded-2xl p-5 flex items-center gap-4 hover:border-purple-500/20 transition-colors cursor-pointer"
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm mb-0.5">{item.title}</p>
                          <p className="text-gray-500 text-sm truncate">{item.desc}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-600 mb-2">{item.time}</p>
                          <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase ${item.tagColor}`}>
                            {item.tag}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---- MY CAMPAIGNS ---- */}
          {activeNav === "campaigns" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-black text-white mb-2">My Campaigns</h1>
                  <p className="text-gray-500 text-sm">{myCampaigns.length} campaigns created</p>
                </div>
                <button
                  onClick={() => navigate("campaign")}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 text-sm"
                >
                  <FaRocket size={14} /> New Campaign
                </button>
              </div>
              {loading ? (
                <div className="text-center py-20">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Loading campaigns...</p>
                </div>
              ) : myCampaigns.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                  <FaRocket className="text-gray-700 mx-auto mb-4" size={40} />
                  <p className="text-white font-bold text-lg mb-2">No campaigns yet</p>
                  <p className="text-gray-500 text-sm mb-6">Start your first campaign and bring your vision to life.</p>
                  <button onClick={() => navigate("campaign")} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                    Start a Campaign
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myCampaigns.map((campaign) => {
                    const percent = campaign.goalAmount ? Math.round((campaign.raisedAmount / campaign.goalAmount) * 100) : 0;
                    const daysLeft = campaign.deadline ? Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24))) : 0;
                    return (
                      <div key={campaign._id} className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group">
                        <div className="h-36 bg-gradient-to-br from-purple-900/40 to-blue-900/30 flex items-center justify-center overflow-hidden">
                          {campaign.image
                            ? <img src={`http://localhost:5000${campaign.image}`} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            : <FaRocket className="text-purple-400/30" size={40} />}
                        </div>
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase ${
                              campaign.status === "active" ? "bg-green-500/20 text-green-400"
                              : campaign.status === "funded" ? "bg-purple-500/20 text-purple-400"
                              : "bg-gray-500/20 text-gray-400"}`}>
                              {campaign.status}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <FiClock size={10} /> {daysLeft} days left
                            </span>
                          </div>
                          <h3 className="text-white font-bold mb-1">{campaign.title}</h3>
                          <p className="text-gray-500 text-xs mb-4 line-clamp-2">{campaign.description}</p>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-white font-semibold">₹{campaign.raisedAmount?.toLocaleString() || 0} raised</span>
                            <span className={`font-bold ${percent >= 100 ? "text-green-400" : "text-purple-400"}`}>{percent}%</span>
                          </div>
                          <div className="bg-white/10 rounded-full h-1">
                            <div className={`h-1 rounded-full transition-all ${percent >= 100 ? "bg-green-500" : "bg-purple-500"}`} style={{ width: `${Math.min(percent, 100)}%` }} />
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-gray-600">Goal: ₹{campaign.goalAmount?.toLocaleString()}</span>
                            <button onClick={() => navigate("campaign-detail", campaign._id)} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                              View <FiArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ---- DONATIONS ---- */}
          {activeNav === "donations" && (
            <div>
              <h1 className="text-3xl font-black text-white mb-2">My Donations</h1>
              <p className="text-gray-500 text-sm mb-8">Campaigns you have backed and supported.</p>
              
              {loading ? (
                <div className="text-center py-20">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                </div>
              ) : myDonations.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                  <FiHeart className="text-gray-700 mx-auto mb-4" size={40} />
                  <p className="text-white font-bold text-lg mb-2">No donations yet</p>
                  <p className="text-gray-500 text-sm mb-6">Explore campaigns and back a project you believe in.</p>
                  <button onClick={() => navigate("explore")} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                    Explore Projects
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myDonations.map((campaign) => (
                    <div key={campaign._id} className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all flex items-center p-4 gap-4">
                      <div className="w-20 h-20 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                         {campaign.image ? (
                           <img src={`http://localhost:5000${campaign.image}`} alt={campaign.title} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center"><FiHeart className="text-purple-400" /></div>
                         )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-sm mb-1">{campaign.title}</h3>
                        <p className="text-gray-400 text-xs mb-2">Total Raised: ₹{campaign.raisedAmount?.toLocaleString()}</p>
                        <button onClick={() => navigate("campaign-detail", campaign._id)} className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                          View Campaign →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---- MESSAGES ---- */}
          {activeNav === "messages" && (
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Messages</h1>
              <p className="text-gray-500 text-sm mb-8">Direct messages from your backers and collaborators.</p>
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                <FiMessageSquare className="text-gray-700 mx-auto mb-4" size={40} />
                <p className="text-white font-bold text-lg mb-2">No messages yet</p>
                <p className="text-gray-500 text-sm">Messages from your backers will appear here.</p>
              </div>
            </div>
          )}

          {/* ---- SETTINGS ---- */}
          {activeNav === "settings" && (
            <div>
              <h1 className="text-3xl font-black text-white mb-8">Settings</h1>
              <div className="bg-white/3 border border-white/8 rounded-2xl p-8 max-w-xl">
                <h3 className="text-white font-bold text-lg mb-6">Profile Information</h3>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-2xl">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-white font-bold">{user?.name}</p>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                    <p className="text-xs text-purple-400 uppercase tracking-widest mt-1">Visionary Member</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                    <input type="text" defaultValue={user?.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500/60 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                    <input type="email" defaultValue={user?.email} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500/60 transition-colors" />
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors mt-2">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---- FULL HISTORY MODAL ---- */}
      {showHistoryModal && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowHistoryModal(false); }}
        >
          <div className="bg-[#13151a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-white/8">
              <div>
                <h2 className="text-white font-bold text-lg">Full Activity History</h2>
                <p className="text-gray-500 text-xs mt-0.5">{filteredHistory.length} events</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <FiX size={20} />
              </button>
            </div>
            <div className="flex gap-2 px-6 pt-4 pb-2 flex-wrap">
              {["all", "project", "financial"].map((f) => (
                <button
                  key={f}
                  onClick={() => setHistoryFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-colors ${
                    historyFilter === f
                      ? "bg-purple-600/30 text-purple-400 border border-purple-500/30"
                      : "text-gray-500 hover:text-white bg-white/3"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto flex-1 px-6 pb-6 pt-2 flex flex-col gap-3">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600 text-sm">No activity found</p>
                </div>
              ) : filteredHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { setSelectedActivity(item); setShowHistoryModal(false); }}
                  className="bg-white/3 border border-white/8 rounded-xl p-4 flex items-center gap-3 hover:border-purple-500/20 transition-colors cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs truncate">{item.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-600 mb-1">{item.time}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-bold uppercase ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---- ACTIVITY DETAIL MODAL ---- */}
      <DetailModal item={selectedActivity} onClose={() => setSelectedActivity(null)} />

      <Footer navigate={navigate} />
    </div>
  );
}

export default DashboardPage;