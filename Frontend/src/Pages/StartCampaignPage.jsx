import { useState} from "react";
import {
  FiArrowRight, FiArrowLeft, FiChevronDown, FiUpload,
  FiPlus, FiCheck, FiShare2
} from "react-icons/fi";
import { BiDollar } from "react-icons/bi";
import { MdVerified } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { campaignAPI } from "../services/api";

const categories = [
  "Art & Installations", "Sustainable Housing", "Urban Revitalization",
  "Tech-Infused Spaces", "Community Hubs", "Eco-Resorts", "Public Art",
];

function StartCampaignPage({ navigate, user, handleLogout }) {
  const [randomVisionId] = useState(() => Math.random().toString(36).substr(2, 6).toUpperCase());
   
  const [step, setStep] = useState(1);  

  // Step 1 data
  const [basics, setBasics] = useState({
    projectName: "", category: "Art & Installations",
    goalAmount: "", duration: "30",
    description: "", image: null,
    imageName: "",
    upiId: "",
  });

  // Step 2 data - reward tiers list
  const [tiers, setTiers] = useState([]);
  const [newTier, setNewTier] = useState({
    name: "", amount: "", description: "", delivery: "", quantity: "",
  });

  // Step 3 data
  const [story, setStory] = useState({
    narrative: "", ecologicalGoal: "", socialImpact: "",
  });

 const [loading, setLoading] = useState(false);
  // FIX 1: createdCampaign wali line hata ditti kyoki aapa usnu aage use nahi kar rahe

 

  
    
   

  // Step 1 field update
  const handleBasicsChange = (field) => (e) =>
    setBasics({ ...basics, [field]: e.target.value });

  // Image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setBasics({ ...basics, image: file, imageName: file.name });
  };

  // Step 2 tier field update
  const handleTierChange = (field) => (e) =>
    setNewTier({ ...newTier, [field]: e.target.value });

  // Add tier to list
  const addTier = () => {
    if (!newTier.name || !newTier.amount) {
      alert("Tier name aur amount zaroor bharo!");
      return;
    }
    setTiers([...tiers, { ...newTier, id: Date.now() }]);
    setNewTier({ name: "", amount: "", description: "", delivery: "", quantity: "" });
  };

  // Remove tier from list
  const removeTier = (id) => setTiers(tiers.filter((t) => t.id !== id));

  // Step 3 field update
  const handleStoryChange = (field) => (e) =>
    setStory({ ...story, [field]: e.target.value });

  // Final launch - submit to backend
  const handleLaunch = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", basics.projectName);
      formData.append("category", basics.category);
      formData.append("goalAmount", basics.goalAmount);
      formData.append("duration", basics.duration);
      formData.append("description", basics.description);
      if (basics.image) formData.append("image", basics.image);
      formData.append("upiId", basics.upiId);

      const data = await campaignAPI.create(formData);
      if (data.success) {
        // FIX 1: setCreatedCampaign hata ditta, sirf step change hovega
        setStep("success");
      } else {
        alert(data.message || "Campaign launch failed!");
      }
    } catch (err) {
      // FIX 2: err nu console ch print kar ditta taaki use ho jaye
      console.error("Campaign creation error:", err);
      alert("Something went wrong!");
    }
    setLoading(false);
  };

  // Sidebar step labels
  const stepLabels = ["Basics & Story", "Rewards & Tiers", "Story & Impact", "Review & Launch"];

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar navigate={navigate} activePage="campaign" user={user} handleLogout={handleLogout} />

      {/* ============ SUCCESS PAGE ============ */}
      {step === "success" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">

          {/* Check Icon */}
          <div className="w-20 h-20 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-8">
            <MdVerified className="text-purple-400" size={36} />
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Your vision is live!</h1>
          <p className="text-xs text-purple-400 uppercase tracking-widest mb-12">
            Campaign Successfully Architected & Verified
          </p>

          {/* Campaign Preview Card */}
          <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden max-w-2xl w-full mb-10 text-left">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-48 h-40 bg-gradient-to-br from-purple-900/40 to-blue-900/30 flex items-center justify-center text-4xl">
                🏗
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-md font-bold">LIVE NOW</span>
                  <span className="text-xs text-gray-500">Launched just now</span>
                </div>
                <h2 className="text-xl font-black text-white mb-2">{basics.projectName}</h2>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">{basics.description}</p>
                <div className="bg-white/10 rounded-full h-1 mb-3">
                  <div className="bg-purple-500 h-1 rounded-full" style={{ width: "1%" }} />
                </div>
                <div className="flex justify-between text-xs">
                  <div>
                    <p className="text-gray-600 uppercase tracking-widest mb-1">Funding Target</p>
                    <p className="text-white font-black text-lg">${basics.goalAmount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-white font-black text-lg">{basics.duration} Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => navigate("explore")}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105"
            >
              View Project <FiArrowRight />
            </button>
            <button
              onClick={() => navigate("home")}
              className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Go to Dashboard
            </button>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              <FiShare2 /> Share Project
            </button>
          </div>

          <p className="text-xs text-gray-700 mt-12 uppercase tracking-widest">
            
           CrowdLift // Verified Vision #{randomVisionId}
          </p>
        </div>
      )}

      {/* ============ NORMAL STEPS 1-4 ============ */}
      {step !== "success" && (
        <div className="flex min-h-screen pt-16">

          {/* ---- LEFT SIDEBAR ---- */}
          <div className="hidden md:flex flex-col w-52 bg-[#080c10] border-r border-white/5 p-6 fixed left-0 top-16 bottom-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-400">
                {user?.name?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <div>
                <p className="text-xs font-bold text-white">CrowdLift</p>
                <p className="text-xs text-gray-600">Visionary Ledger</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 uppercase tracking-widest mb-4">Editor Progress</p>

            {stepLabels.map((label, i) => (
              <button
                key={i}
                onClick={() => i + 1 < step && setStep(i + 1)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-all ${
                  step === i + 1
                    ? "bg-purple-600/20 border border-purple-500/30 text-purple-400"
                    : i + 1 < step
                    ? "text-gray-400 hover:text-white cursor-pointer"
                    : "text-gray-700 cursor-default"
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${
                  i + 1 < step
                    ? "bg-green-500/20 border-green-500/40 text-green-400"
                    : step === i + 1
                    ? "bg-purple-500/20 border-purple-500/40 text-purple-400"
                    : "border-white/10 text-gray-700"
                }`}>
                  {i + 1 < step ? <FiCheck size={10} /> : i + 1}
                </div>
                <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
              </button>
            ))}

            <div className="mt-auto">
              <button className="w-full border border-white/10 text-gray-500 hover:text-white text-xs py-2 rounded-lg transition-colors">
                Save Draft
              </button>
            </div>
          </div>

          {/* ---- MAIN CONTENT AREA ---- */}
          <div className="flex-1 md:ml-52 p-8 max-w-4xl">

            {/* Step Header */}
            <div className="mb-8">
              <p className="text-xs text-purple-400 uppercase tracking-widest mb-2">
                Step 0{step} of 04
              </p>
              <h1 className="text-4xl font-black text-white mb-3">
                {step === 1 && "Basics & Story"}
                {step === 2 && "Rewards & Tiers"}
                {step === 3 && <span>Crafting the <span className="text-purple-400">Vision.</span></span>}
                {step === 4 && "Architectural Audit"}
              </h1>
              <p className="text-gray-400 max-w-xl leading-relaxed text-sm">
                {step === 1 && "Fill in the details below to start your journey. Our Architectural Curator will help you frame your vision."}
                {step === 2 && "Design the architectural incentives for your backers. Define clear value propositions and delivery timelines to build trust."}
                {step === 3 && "Articulate the architectural impact of your endeavor. This is where your backers connect with the legacy you're building."}
                {step === 4 && "Review the final ledger entries for your project. Once launched, core structural details cannot be altered during the live phase."}
              </p>
            </div>

            {/* ---- STEP 1: BASICS ---- */}
            {step === 1 && (
              <div className="flex flex-col gap-6">
                {/* Project Identity */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h3 className="text-purple-400 font-bold text-lg mb-2">Project Identity</h3>
                      <p className="text-sm text-gray-500">Set the tone and category for your campaign.</p>
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Give your project a name.</label>
                        <input type="text" placeholder="e.g. The Vertical Forest Pavilion"
                          value={basics.projectName} onChange={handleBasicsChange("projectName")}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Category</label>
                        <div className="relative">
                          <select value={basics.category} onChange={handleBasicsChange("category")}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none cursor-pointer">
                            {categories.map((cat) => <option key={cat} value={cat} className="bg-[#0d1117]">{cat}</option>)}
                          </select>
                          <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                       // Category dropdown ke baad add karo
                       <div>
                       <label className="block text-sm text-gray-400 mb-2">
                         Your UPI ID (payments directly to you)
                       </label>
                       <input
                         type="text"
                         placeholder="e.g. yourname@paytm / 9876543210@upi"
                         value={basics.upiId}
                         onChange={handleBasicsChange("upiId")}
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
                       />
                        <p className="text-xs text-gray-600 mt-1">
                           Backers will pay directly to this UPI ID
                          </p>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h3 className="text-purple-400 font-bold text-lg mb-2">Milestones</h3>
                      <p className="text-sm text-gray-500">Define your funding goals and timeline.</p>
                    </div>
                    <div className="flex-1 flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-400 mb-2">Goal Amount</label>
                        <div className="relative">
                          <BiDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input type="number" placeholder="50,000" value={basics.goalAmount}
                            onChange={handleBasicsChange("goalAmount")}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-400 mb-2">Duration (Days)</label>
                        <input type="number" placeholder="30" value={basics.duration}
                          onChange={handleBasicsChange("duration")}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Story Upload */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h3 className="text-purple-400 font-bold text-lg mb-2">Visual Story</h3>
                      <p className="text-sm text-gray-500">Upload a high-quality project image or video.</p>
                    </div>
                    <div className="flex-1">
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-2xl p-12 text-center transition-colors">
                          <FiUpload className="text-gray-500 mx-auto mb-3" size={28} />
                          {basics.imageName
                            ? <p className="text-sm text-purple-400 font-medium">{basics.imageName}</p>
                            : <>
                                <p className="text-sm text-white font-semibold mb-1">Drag and drop your media</p>
                                <p className="text-xs text-gray-600">High-res JPG, PNG or MP4 (Max 50MB)</p>
                              </>
                          }
                        </div>
                        <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h3 className="text-purple-400 font-bold text-lg mb-2">Brief Description</h3>
                      <p className="text-sm text-gray-500">Sum up your project in a way that captures the imagination.</p>
                    </div>
                    <div className="flex-1">
                      <textarea placeholder="Tell the world why your project matters..."
                        value={basics.description} onChange={handleBasicsChange("description")}
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---- STEP 2: REWARDS & TIERS ---- */}
            {step === 2 && (
              <div className="flex flex-col md:flex-row gap-6">
                {/* Add Tier Form */}
                <div className="flex-1">
                  <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-6">Add New Tier</h3>
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Tier Name</label>
                        <input type="text" placeholder="e.g. Early Visionary" value={newTier.name}
                          onChange={handleTierChange("name")}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Pledge Amount (USD)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <input type="number" placeholder="0.00" value={newTier.amount}
                            onChange={handleTierChange("amount")}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Tier Description</label>
                      <textarea placeholder="Detail exactly what your backers will receive..." value={newTier.description}
                        onChange={handleTierChange("description")} rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors resize-none"
                      />
                    </div>
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Estimated Delivery</label>
                        <input type="month" value={newTier.delivery} onChange={handleTierChange("delivery")}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500/60 transition-colors"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Quantity Limit (Optional)</label>
                        <input type="number" placeholder="Unlimited" value={newTier.quantity}
                          onChange={handleTierChange("quantity")}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <button onClick={() => setNewTier({ name: "", amount: "", description: "", delivery: "", quantity: "" })}
                        className="text-xs text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors">
                        Clear Inputs
                      </button>
                      <button onClick={addTier}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                        <FiPlus size={16} /> Add Tier to Ledger
                      </button>
                    </div>
                  </div>
                </div>

                {/* Drafted Tiers */}
                <div className="md:w-72">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold">Drafted Tiers</h3>
                    <span className="bg-purple-600/20 text-purple-400 text-xs px-2 py-1 rounded-md font-bold">
                      {tiers.length} Items
                    </span>
                  </div>
                  {tiers.length === 0 && (
                    <div className="border-2 border-dashed border-white/5 rounded-2xl p-8 text-center">
                      <FiPlus className="text-gray-700 mx-auto mb-2" size={24} />
                      <p className="text-xs text-gray-700">More space for your vision</p>
                    </div>
                  )}
                  <div className="flex flex-col gap-4">
                    {tiers.map((tier, i) => (
                      <div key={tier.id} className="bg-white/3 border border-white/8 rounded-2xl p-5">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs text-purple-400 uppercase tracking-widest mb-1">Tier 0{i + 1}</p>
                            <p className="font-bold text-white">{tier.name}</p>
                          </div>
                          <p className="text-xl font-black text-white">${tier.amount}</p>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{tier.description}</p>
                        <div className="flex justify-between text-xs text-gray-600 mb-3">
                          {tier.delivery && <span> {tier.delivery}</span>}
                          <span> {tier.quantity ? `Limited (${tier.quantity})` : "Unlimited"}</span>
                        </div>
                        <div className="flex gap-4 border-t border-white/5 pt-3">
                          <button className="text-xs text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Edit</button>
                          <button onClick={() => removeTier(tier.id)}
                            className="text-xs text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ---- STEP 3: STORY & IMPACT ---- */}
            {step === 3 && (
              <div className="flex flex-col gap-6">
                {/* Narrative Editor */}
                <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Project Narrative</p>
                    <div className="flex gap-3 text-gray-600 text-sm">
                      <button className="hover:text-white font-bold transition-colors">B</button>
                      <button className="hover:text-white italic transition-colors">I</button>
                      <button className="hover:text-white transition-colors">🔗</button>
                      <button className="hover:text-white transition-colors">🖼</button>
                    </div>
                  </div>
                  <textarea
                    placeholder="Begin your story here... Describe the catalyst for this project and the future it creates."
                    value={story.narrative} onChange={handleStoryChange("narrative")}
                    rows={10}
                    className="w-full bg-transparent px-6 py-4 text-sm text-white placeholder-gray-700 outline-none resize-none"
                  />
                  <div className="px-6 py-3 border-t border-white/5 text-right">
                    <span className="text-xs text-gray-700 uppercase tracking-widest">Visual Editor Active</span>
                  </div>
                </div>

                {/* Impact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="flex items-center gap-2 mb-4">
                      <span>🌿</span>
                      <h3 className="font-bold text-white">Ecological Footprint</h3>
                    </div>
                    <input type="text" placeholder="Sustainability goal..." value={story.ecologicalGoal}
                      onChange={handleStoryChange("ecologicalGoal")}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-green-500/40 transition-colors mb-3"
                    />
                    <p className="text-xs text-gray-600 italic">
                      Describe how this project respects and restores the natural architecture of its environment.
                    </p>
                  </div>
                  <div className="bg-white/3 border-l-2 border-blue-500/40 border border-white/8 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span>👥</span>
                      <h3 className="font-bold text-white">Social Catalyst</h3>
                    </div>
                    <input type="text" placeholder="Community impact..." value={story.socialImpact}
                      onChange={handleStoryChange("socialImpact")}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/40 transition-colors mb-3"
                    />
                    <p className="text-xs text-gray-600 italic">
                      Detail the lasting human connections and empowerment this ledger will facilitate.
                    </p>
                  </div>
                </div>
              // </div>
            )}

            {/* ---- STEP 4: REVIEW & LAUNCH ---- */}
            {step === 4 && (
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Review */}
                <div className="flex-1 flex flex-col gap-6">
                  {/* Step Numbers */}
                  <div className="flex items-center justify-between mb-2">
                    {["Identity", "Milestones", "Rewards", "Review"].map((label, i) => (
                      <div key={label} className="flex flex-col items-center gap-1">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                          i < 3 ? "bg-purple-600 text-white" : "bg-purple-600 text-white ring-2 ring-purple-400"
                        }`}>{i + 1}</div>
                        <p className="text-xs text-gray-600 uppercase tracking-widest">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Identity Summary */}
                  <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-bold text-lg">01 Identity Summary</h3>
                      <button onClick={() => setStep(1)} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                        Edit Section
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Project Name</p>
                      <p className="text-white font-bold text-lg mb-3">{basics.projectName || "—"}</p>
                      <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Brief Intent</p>
                      <p className="text-gray-400 text-sm">{basics.description || "—"}</p>
                    </div>
                  </div>

                  {/* Funding Milestones */}
                  <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-bold text-lg">02 Funding Milestones</h3>
                      <button onClick={() => setStep(1)} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                        Adjust Targets
                      </button>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <div>
                        <p className="text-white font-semibold">Goal Amount</p>
                        <p className="text-xs text-gray-500">Duration: {basics.duration} days</p>
                      </div>
                      <p className="text-purple-400 font-black text-xl">${basics.goalAmount || "0"}</p>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <p className="text-white font-semibold">Category</p>
                      <p className="text-gray-400 text-sm">{basics.category}</p>
                    </div>
                  </div>
                </div>

                {/* Right Launch Panel */}
                <div className="md:w-72 flex flex-col gap-4">
                  <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-4">Ready for Launch?</h3>
                    {[
                      { label: "Identity Verified", done: !!basics.projectName },
                      { label: "Financial Compliance Pass", done: !!basics.goalAmount },
                      { label: "Rewards Structure Validated", done: tiers.length > 0 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 mb-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          item.done ? "bg-green-500/20 text-green-400" : "bg-white/5 text-gray-700"
                        }`}>
                          <FiCheck size={10} />
                        </div>
                        <p className={`text-sm ${item.done ? "text-white" : "text-gray-600"}`}>{item.label}</p>
                      </div>
                    ))}
                    <button onClick={handleLaunch} disabled={loading}
                      className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02]">
                      {loading ? "Launching..." : "Launch Campaign"}
                    </button>
                    <p className="text-xs text-gray-600 text-center mt-3 leading-relaxed">
                      By clicking launch, you agree to the Architectural Guidelines and CrowdLift Terms of Service.
                    </p>
                  </div>

                  {/* Tiers Summary */}
                  {tiers.length > 0 && (
                    <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Reward Tiers</p>
                        <span className="text-xs text-green-400 font-bold">{tiers.length} Active</span>
                      </div>
                      {tiers.map((tier) => (
                        <div key={tier.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                          <div>
                            <p className="text-sm text-white font-medium">{tier.name}</p>
                            <p className="text-xs text-gray-600">${tier.amount} tier</p>
                          </div>
                          <FiArrowRight className="text-gray-600" size={14} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---- NAVIGATION BUTTONS ---- */}
            <div className="flex justify-between items-center mt-10">
              {step > 1
                ? <button onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                    <FiArrowLeft />
                    {step === 2 ? "Back to Basics" : step === 3 ? "Back: Rewards" : "Back to Story"}
                  </button>
                : <div />
              }
              {step < 4 && (
                <button
                  onClick={() => {
                    if (step === 1 && (!basics.projectName || !basics.description || !basics.goalAmount)) {
                      alert("Project name, description aur goal amount zaroor bharo!");
                      return;
                    }
                    setStep(step + 1);
                  }}
                  className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105"
                >
                  {step === 3 ? "Final Review" : "Next Step"} <FiArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {step !== "success" && <Footer navigate={navigate} />}
    </div>
  );
}

export default StartCampaignPage;