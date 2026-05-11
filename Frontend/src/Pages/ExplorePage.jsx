 import { useState, useEffect } from "react";
import { FiSearch, FiClock, FiChevronDown } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { FaRocket } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { campaignAPI } from "../services/api";

// Filter categories
const filters = [
  "All Projects", "Sustainable Housing", "Urban Revitalization",
  "Tech-Infused Spaces", "Community Hubs", "Eco-Resorts", "Public Art",
];

function ExplorePage({ navigate, user, handleLogout }) {
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

   
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      const params = { page, limit: 6 };
      if (activeFilter !== "All Projects") params.category = activeFilter;
      if (searchQuery) params.search = searchQuery;

      const data = await campaignAPI.getAll(params);
      if (data.success) {
        setProjects(data.campaigns);
        setTotal(data.total || 0);
      }
      setLoading(false);
    };
    fetchCampaigns();
  }, [activeFilter, searchQuery, page]);

  return (
    <div>
      <Navbar navigate={navigate} activePage="explore" user={user} handleLogout={handleLogout} />

      {/* ---- HERO HEADER ---- */}
      <section className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <p className="text-xs text-purple-400 uppercase tracking-widest mb-3">Curation Hub</p>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Discover the next<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Architectural Marvel.
              </span>
            </h1>
            <p className="text-gray-400 max-w-xl leading-relaxed">
              Browse through projects that redefine spaces, community, and sustainable living.
              Handpicked for the Architectural Curator.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 flex-wrap mt-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => { setActiveFilter(filter); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* ---- PROJECTS GRID ---- */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading campaigns...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
            <FaRocket className="text-gray-700 mx-auto mb-4" size={40} />
            <p className="text-white font-bold text-lg mb-2">No campaigns found</p>
            <p className="text-gray-500 text-sm mb-6">
              {searchQuery ? `No results for "${searchQuery}"` : "No campaigns in this category yet."}
            </p>
            <button
              onClick={() => navigate("campaign")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Start a Campaign
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => {
              const percent = project.goalAmount
                ? parseFloat(((project.raisedAmount || 0) / project.goalAmount * 100).toFixed(1))
                : 0;
              const daysLeft = project.deadline
                ? Math.max(0, Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
                : 0;

              return (
                // ← Campaign card click karo → detail page te jao
                <div
                  key={project._id}
                  onClick={() => navigate("campaign-detail", project._id)}
                  className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all hover:-translate-y-1 cursor-pointer group"
                >
                  {/* Project Image */}
                  <div className="relative overflow-hidden h-52 bg-gradient-to-br from-purple-900/30 to-blue-900/20">
                    {project.image ? (
                      <img
                        src={`http://localhost:5000${project.image}`}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaRocket className="text-purple-400/20" size={48} />
                      </div>
                    )}
                    {/* Status Badge */}
                    {project.status === "funded" && (
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                        FUNDED
                      </span>
                    )}
                    {project.isVerified && (
                      <span className="absolute top-3 right-3 bg-blue-500/80 text-white text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1">
                        <MdVerified size={10} /> Verified
                      </span>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-5">
                    <p className="text-xs text-purple-400 font-semibold uppercase tracking-widest mb-2">
                      {project.category}
                    </p>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* Amount + Percentage */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold">
                        ₹{project.raisedAmount?.toLocaleString() || 0} raised
                      </span>
                      <span className={`text-sm font-semibold ${
                        percent >= 100 ? "text-green-400" : "text-purple-400"
                      }`}>
                        {percent}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white/10 rounded-full h-1 mb-3">
                      <div
                        className={`h-1 rounded-full ${
                          percent >= 100 ? "bg-green-500" : "bg-purple-500"
                        }`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>

                    {/* Creator + Days Left */}
                    <div className="flex justify-between text-xs text-gray-500 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {project.creator?.name?.charAt(0)?.toUpperCase() || "C"}
                        </div>
                        <span>by {project.creator?.name || "Creator"}</span>
                      </div>
                      <span className={`flex items-center gap-1 ${project.status === "funded" ? "text-green-400" : ""}`}>
                        {project.status === "funded" ? <MdVerified /> : <FiClock size={10} />}
                        {project.status === "funded" ? "Funded" : `${daysLeft} days left`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {!loading && projects.length > 0 && projects.length < total && (
          <div className="text-center mt-12">
            <button
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-2 mx-auto border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-xl transition-colors text-sm"
            >
              Load More Projects <FiChevronDown />
            </button>
            <p className="text-xs text-gray-600 mt-3">
              Viewing {projects.length} of {total} total projects
            </p>
          </div>
        )}
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}

export default ExplorePage;