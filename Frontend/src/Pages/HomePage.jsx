import { useState, useEffect } from "react";
import { FiArrowRight, FiClock } from "react-icons/fi";
import { FaRocket } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { campaignAPI } from "../services/api";

function HomePage({ navigate, user, handleLogout }) {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

   
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [donorName, setDonorName] = useState("");
  const [donorMobile, setDonorMobile] = useState("");
  useEffect(() => {
    const fetchFeatured = async () => {
      setLoadingCampaigns(true);
      try {
        const data = await campaignAPI.getAll({ limit: 3 });
        if (data.success) setFeaturedCampaigns(data.campaigns);
      } catch (err) {
        console.error("Featured fetch error:", err);
      }
      setLoadingCampaigns(false);
    };
    fetchFeatured();
  }, []);

 
  const scrollToCampaigns = () => {
    const section = document.getElementById("featured-campaigns");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // When a campaign card is clicked
  const handleCampaignClick = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setShowDonorModal(true); // Open the modal instead of navigating directly
  };

  // Handle Modal Submission
  const handleDonorSubmit = (e) => {
    e.preventDefault();
    if (!donorName || !donorMobile) return;

 
    const donorData = {
      name: donorName,
      mobile: donorMobile,
    };
    localStorage.setItem("tempDonorData", JSON.stringify(donorData));

    // Close modal and navigate to detail page
    setShowDonorModal(false);
    navigate("campaign-detail", selectedCampaignId);
  };

  return (
    <div>
      <Navbar navigate={navigate} activePage="home" user={user} handleLogout={handleLogout} />

      {/* ---- HERO SECTION ---- */}
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left: Text */}
          <div className="flex-1">
            <p className="text-xs text-purple-400 uppercase tracking-widest mb-4 font-semibold">
              CrowdLift Impact
            </p>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 text-white">
              Empowering ideas,{" "}
              <span className="italic text-purple-400">one contribution</span>{" "}
              at a time.
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl">
              The Architectural Curator of crowdfunding. We provide the tools for creators to turn
              visionary concepts into global realities through community backing.
            </p>
            <div className="flex flex-col gap-4 max-w-[500px]">
              
              {/* Row 1: Two equal buttons side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("campaign")}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full py-3.5 rounded-xl font-semibold transition-all hover:-translate-y-1"
                >
                  Start Your Campaign
                </button>

                <button
                  onClick={scrollToCampaigns}
                  className="bg-green-600 hover:bg-green-500 text-white w-full py-3.5 rounded-xl font-semibold transition-all hover:-translate-y-1 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                >
                  Donate for Campaign
                </button>
              </div>

              {/* Row 2: One full-width button centered */}
              <button
                onClick={() => navigate("explore")}
                className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white w-full py-3.5 rounded-xl font-semibold transition-all"
              >
                Browse Projects
              </button>
              
            </div>
          </div>

          {/* Right: Hero Card */}
          <div className="flex-1 flex justify-center">
            <div className="relative bg-gradient-to-br from-purple-900/40 to-blue-900/30 border border-purple-500/20 rounded-2xl p-6 w-full max-w-md backdrop-blur-sm">
              <div
                className="absolute inset-0 opacity-10 rounded-2xl"
                style={{
                  backgroundImage: "radial-gradient(circle, #a855f7 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative text-center py-10">
                <div className="flex flex-col items-center gap-3 mb-6">
                  {[80, 56, 36].map((w, i) => (
                    <div key={i} className="h-10 rounded-xl bg-white/10 border border-white/20"
                      style={{ width: `${w}%` }} />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <MdVerified className="text-green-400" size={18} />
                  <span className="text-sm text-green-400 font-medium">Verified Community Project</span>
                </div>
                <div className="bg-white/10 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: "75%" }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>75% Funded</span>
                  <span>$45,000 to go</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- FEATURED CAMPAIGNS ---- */}
      {/* Added ID here for smooth scrolling */}
      <section id="featured-campaigns" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs text-purple-400 uppercase tracking-widest mb-2">Curated Picks</p>
            <h2 className="text-3xl font-bold text-white">Featured Campaigns</h2>
          </div>
          <button
            onClick={() => navigate("explore")}
            className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            View All <FiArrowRight />
          </button>
        </div>

        {/* Loading */}
        {loadingCampaigns && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-600 text-sm">Loading campaigns...</p>
          </div>
        )}

        {/* No campaigns yet */}
        {!loadingCampaigns && featuredCampaigns.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl">
            <FaRocket className="text-gray-700 mx-auto mb-4" size={36} />
            <p className="text-gray-500 text-sm mb-4">No campaigns yet. Be the first!</p>
            <button
              onClick={() => navigate("campaign")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl text-sm transition-colors"
            >
              Start a Campaign
            </button>
          </div>
        )}

        {/* Campaign Cards */}
        {!loadingCampaigns && featuredCampaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCampaigns.map((campaign) => {
              const percent = campaign.goalAmount
                ? parseFloat(((campaign.raisedAmount || 0) / campaign.goalAmount * 100).toFixed(1))
                : 0;
              const daysLeft = campaign.deadline
                ? Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
                : 0;

              return (
                // Changed onClick from navigate to handleCampaignClick
                <div
                  key={campaign._id}
                  onClick={() => handleCampaignClick(campaign._id)}
                  className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all hover:-translate-y-1 cursor-pointer group"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-48 bg-gradient-to-br from-purple-900/30 to-blue-900/20">
                    {campaign.image ? (
                      <img
                        src={`http://localhost:5000${campaign.image}`}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaRocket className="text-purple-400/20" size={40} />
                      </div>
                    )}
                    {campaign.status === "funded" && (
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                        FUNDED
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-xs text-purple-400 font-semibold uppercase tracking-widest mb-1">
                      {campaign.category}
                    </p>
                    <h3 className="font-bold text-white mb-2 text-sm leading-snug line-clamp-1">
                      {campaign.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">
                      {campaign.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="bg-white/10 rounded-full h-1 mb-3">
                      <div
                        className={`h-1 rounded-full ${percent >= 100 ? "bg-green-500" : "bg-purple-500"}`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span className="text-purple-400 font-semibold">{percent}% funded</span>
                      <span>₹{campaign.raisedAmount?.toLocaleString() || 0} raised</span>
                      <span className="flex items-center gap-1">
                        <FiClock size={10} /> {daysLeft} days left
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

       {/* ---- THREE STEPS SECTION ---- */}
      <section className="py-24 px-6 bg-white/2">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-purple-400 uppercase tracking-widest mb-3">Our Framework</p>
          <h2 className="text-3xl font-bold text-white mb-16">Three steps to launch.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/3 border border-white/10 rounded-2xl p-8 text-left">
              <p className="text-5xl font-black text-white/10 mb-4">01</p>
              <h3 className="text-lg font-bold text-white mb-3">Draft Your Vision</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Use our curator tools to build a narrative that resonates with the collective.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-left">
              <p className="text-5xl font-black text-white/20 mb-4">02</p>
              <h3 className="text-lg font-bold text-white mb-3">Engage the Crowd</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Launch your campaign to our global network of early adopters and curators.
              </p>
            </div>
            <div className="bg-white/3 border border-white/10 rounded-2xl p-8 text-left">
              <p className="text-5xl font-black text-white/10 mb-4">03</p>
              <h3 className="text-lg font-bold text-white mb-3">Bring to Life</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Receive your funds, start production, and keep your backers updated on your journey.
              </p>
            </div>
          </div>
 
          {/* Ready to Ignite */}
          <div className="mt-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-8 inline-flex flex-col items-center gap-4">
            <FaRocket size={28} className="text-white" />
            <p className="text-white font-bold uppercase tracking-widest text-sm">Ready to Ignite?</p>
            <button
              onClick={() => navigate("campaign")}
              className="bg-white text-red-600 font-bold px-6 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              START NOW
            </button>
          </div>
        </div>
      </section>
 
      {/* ---- STATS SECTION ---- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-6">
              "CrowdLift changed how I view product launches. It's not just funding; it's community
              architectural design."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                MV
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Marcus Vance</p>
                <p className="text-xs text-gray-500">Founder, Vora Labs</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "500+", label: "Successful Projects" },
              { value: "$45M", label: "Total Funded" },
              { value: "12k+", label: "Active Curators" },
              { value: "98%", label: "Trust Rating" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ---- CTA SECTION ---- */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-purple-900/60 to-blue-900/40 border border-purple-500/20 rounded-3xl p-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Your idea deserves a global stage.
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Join the ranks of thousands of creators who turned their blueprints into tangible success stories.
          </p>
          <button
            onClick={() => navigate("campaign")}
            className="bg-white text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all hover:scale-105"
          >
            Start Your Campaign
          </button>
        </div>
      </section>

      <Footer navigate={navigate} />

      {/* =========================================
          DONOR MODAL (Name & Mobile Number Popup)
          ========================================= */}
      {showDonorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-purple-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">Support this Campaign</h3>
            <p className="text-gray-400 text-sm mb-6">
              Please enter your details to proceed to the donation page.
            </p>

            <form onSubmit={handleDonorSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-semibold mb-2">Full Name</label>
                <input
  type="text"
  required
  value={donorName}
  onChange={(e) => setDonorName(e.target.value)}  
  placeholder="Enter your name"
  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
/>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-semibold mb-2">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={donorMobile}
                  onChange={(e) => setDonorMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  pattern="[0-9]{10}"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowDonorModal(false)}
                  className="flex-1 border border-white/10 hover:bg-white/5 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default HomePage;