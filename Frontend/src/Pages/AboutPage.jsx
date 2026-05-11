 
import { FiShield, FiUsers, FiZap } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const team = [
  { name: "Julian Vance", role: "CEO & Founder", initials: "JV" },
  { name: "Elena Thorne", role: "Head of Design", initials: "ET" },
  { name: "Marcus Chen", role: "CTO", initials: "MC" },
  { name: "Sarah Jenkins", role: "Community Lead", initials: "SJ" },
];


const pillars = [
  {
    icon: <FiShield size={24} />,
    title: "Transparency",
    desc: "We operate with radical honesty. Every dollar is tracked, and every milestone is verified through our proprietary validation engine.",
    color: "text-purple-400",
  },
  {
    icon: <FiUsers size={24} />,
    title: "Community",
    desc: "Identity is everything. We prioritize human connections over transactional data, fostering long-term relationships between creators and fans.",
    color: "text-pink-400",
  },
  {
    icon: <FiZap size={24} />,
    title: "Innovation",
    desc: "We don't just follow trends; we set them. Our AI-driven discovery tools ensure that high-potential projects find the right eyes.",
    color: "text-blue-400",
  },
];

function AboutPage({ navigate, user, handleLogout }) {
  return (
    <div>
      <Navbar navigate={navigate} activePage="about" user={user} handleLogout={handleLogout} />

      {/* ---- MISSION HERO ---- */}
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Left: Text */}
          <div className="flex-1">
            <p className="text-xs text-purple-400 uppercase tracking-widest mb-4">Our Mission</p>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Empowering the{" "}
              <span className="text-purple-400">Architects</span>{" "}
              of Tomorrow.
            </h1>
            <p className="text-gray-400 leading-relaxed text-lg max-w-xl">
              At CrowdLift, we believe that great ideas shouldn't die in a spreadsheet. We've built a
              curated ecosystem where creators find the capital they need and donors find the stories that
              move them. Our platform is designed to be the bridge between visionary intent and collective
              impact.
            </p>
          </div>

          {/* Right: Image Placeholder */}
          <div className="flex-1 relative">
            <div className="rounded-2xl overflow-hidden h-72 bg-gradient-to-br from-purple-900/40 to-blue-900/30 border border-purple-500/20 flex items-center justify-center">
              <div className="text-center">
                <FiUsers size={40} className="text-purple-400 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Our Team at Work</p>
              </div>
            </div>

            {/* Community Trusted floating badge */}
            <div className="absolute bottom-4 right-4 bg-[#0d1117]/90 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <div>
                <p className="text-xs font-semibold text-white">Community Trusted</p>
                <p className="text-xs text-gray-500">Vetted by the Collective</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- STATS SECTION ---- */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { value: "$420M+", label: "Total Raised", sub: "Fuelling innovation across 140 countries." },
            { value: "12.5K", label: "Campaigns Launched", sub: "From boutique architecture to tech giants." },
            { value: "1.2M", label: "Global Backers", sub: "A growing community of active supporters." },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-black text-purple-400 mb-1">{stat.value}</p>
              <p className="text-sm font-semibold text-white uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-xs text-gray-500">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <p className="text-xs text-purple-400 uppercase tracking-widest mb-2">The CrowdLift Way</p>
        <h2 className="text-3xl font-bold text-white mb-12">Three Pillars of Excellence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white/3 border border-white/8 rounded-2xl p-8 hover:border-purple-500/30 transition-colors"
            >
              <div className={`${pillar.color} mb-4`}>{pillar.icon}</div>
              <h3 className="text-lg font-bold text-white mb-3">{pillar.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-3">The Curators Behind the Platform</h2>
        <p className="text-gray-400 mb-12 text-sm">
          A dedicated team of designers, engineers, and strategists working together to redefine the
          future of funding.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="group">
              {/* Avatar Box with initials */}
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-purple-900/40 to-blue-900/30 border border-white/10 flex items-center justify-center mb-4 group-hover:border-purple-500/30 transition-colors text-4xl font-black text-white/20">
                {member.initials}
              </div>
              <p className="font-bold text-white text-sm">{member.name}</p>
              <p className="text-xs text-purple-400 uppercase tracking-widest mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- BOTTOM CTA ---- */}
      <section className="py-16 px-6 mb-12">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to lift your idea?</h2>
          <p className="text-white/70 mb-8 text-sm leading-relaxed">
            Join the collective and start your journey today. We're here to help you every step of
            the way.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("campaign")}
              className="bg-white text-purple-700 font-bold px-6 py-3 rounded-xl text-sm hover:bg-gray-100 transition-colors"
            >
              Start Your Project
            </button>
            <button
              onClick={() => navigate("explore")}
              className="border border-white/40 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors"
            >
              Explore Others
            </button>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}

export default AboutPage;