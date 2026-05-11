import { useState, useEffect } from "react";
import {
  FiArrowLeft, FiShare2, FiHeart, FiCheck,
  FiX, FiCopy, FiSmartphone
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { FaRocket } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { campaignAPI } from "../services/api";

function CampaignDetailPage({ navigate, user, handleLogout, campaignId }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  // Payment Modal states
  const [showPayment, setShowPayment] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentStep, setPaymentStep] = useState(1);
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch campaign
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!campaignId) return;
      setLoading(true);
      setCampaign(null);
      try {
        const data = await campaignAPI.getById(campaignId);
        if (data.success) {
          console.log("Campaign fetched:", data.campaign?.title);
          console.log("Creator upiId:", data.campaign?.creator?.upiId);
          setCampaign(data.campaign);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
      setLoading(false);
    };
    fetchCampaign();
  }, [campaignId]);

  const finalAmount = customAmount || selectedAmount;

  // UPI ID - creator toh lo (backend ab guarantee deta hai)
  const upiId = campaign?.creator?.upiId || "";

  // UPI URL
  const upiUrl = upiId
    ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(campaign?.creator?.name || "Creator")}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent("CrowdLift: " + (campaign?.title || ""))}`
    : "";

  // QR URL
  const qrUrl = upiId
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}&bgcolor=ffffff&color=000000&margin=10`
    : "";

  // Copy UPI ID
  const copyUpiId = () => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Confirm payment - backend update
  const handleConfirmPayment = async () => {
    setConfirming(true);
     
    const storedDonorData = localStorage.getItem("tempDonorData");
    let donorName = user ? user.name : "Guest";
    let donorMobile = "";

    if (storedDonorData) {
      const parsedData = JSON.parse(storedDonorData);
      donorName = parsedData.name || donorName;
      donorMobile = parsedData.mobile || "";
    }

    try {
       
      const paymentData = {
        amount: Number(finalAmount),
        donorName: donorName,
        donorMobile: donorMobile
      };

      const data = await campaignAPI.back(campaignId, paymentData);
      
      if (data.success) {
        setCampaign(data.campaign);
        setPaymentStep(4);
        localStorage.removeItem("tempDonorData"); // Clean up
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong!");
      console.error(err);
    }
    setConfirming(false);
  };

  // Close modal
  const closeModal = () => {
    setShowPayment(false);
    setPaymentStep(1);
    setSelectedAmount("");
    setCustomAmount("");
    setCopied(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <FaRocket className="text-gray-700 mx-auto mb-4" size={48} />
          <p className="text-white font-bold text-xl mb-2">Campaign not found</p>
          <button onClick={() => navigate("explore")} className="text-purple-400 hover:text-purple-300 text-sm">
            ← Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const percent = campaign.goalAmount
    ? parseFloat(((campaign.raisedAmount || 0) / campaign.goalAmount * 100).toFixed(1))
    : 0;
  const daysLeft = campaign.deadline
    ? Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;
  const backersCount = campaign.backers?.length || 0;

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar navigate={navigate} activePage="explore" user={user} handleLogout={handleLogout} />

      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <button onClick={() => navigate("explore")}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm mb-8">
          <FiArrowLeft size={16} /> Back to Explore
        </button>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT: Main Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-xs text-purple-400 uppercase tracking-widest font-semibold">{campaign.category}</span>
              {campaign.isVerified && (
                <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                  <MdVerified size={14} /> Verified
                </div>
              )}
              <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase ${
                campaign.status === "active" ? "bg-green-500/20 text-green-400"
                : campaign.status === "funded" ? "bg-purple-500/20 text-purple-400"
                : "bg-gray-500/20 text-gray-400"
              }`}>{campaign.status}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">{campaign.title}</h1>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden h-72 md:h-96 mb-8 bg-gradient-to-br from-purple-900/40 to-blue-900/30">
              {campaign.image ? (
                <img src={`http://localhost:5000${campaign.image}`} alt={campaign.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaRocket className="text-purple-400/30" size={64} />
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: `₹${(campaign.raisedAmount || 0).toLocaleString()}`, label: "Raised" },
                { value: backersCount, label: "Backers" },
                { value: daysLeft, label: "Days Left" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/3 border border-white/8 rounded-2xl p-5 text-center">
                  <p className="text-2xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-bold text-lg">{percent}% funded</span>
                <span className="text-gray-400 text-sm">Goal: ₹{(campaign.goalAmount || 0).toLocaleString()}</span>
              </div>
              <div className="bg-white/10 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${percent >= 100 ? "bg-green-500" : "bg-gradient-to-r from-purple-500 to-pink-500"}`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-8 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">About This Project</h2>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line">{campaign.description}</p>
            </div>

            {/* Creator */}
            {campaign.creator && (
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Project Creator</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                    {campaign.creator.name?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                  <div>
                    <p className="text-white font-bold">{campaign.creator.name}</p>
                    <p className="text-gray-500 text-sm">{campaign.creator.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Backers */}
            {campaign.backers?.length > 0 && (
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
                  Recent Backers ({backersCount})
                </h2>
                <div className="flex flex-col">
                  {campaign.backers.slice(-5).reverse().map((backer, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">
                          {backer.user?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="text-gray-400 text-sm">{backer.user?.name || "Anonymous"}</span>
                      </div>
                      <span className="text-white font-bold text-sm">₹{(backer.amount || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Payment Panel */}
          <div className="lg:w-80 flex flex-col gap-4">
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6">

              {percent >= 100 && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4">
                  <MdVerified className="text-green-400" size={18} />
                  <span className="text-green-400 text-sm font-semibold">Fully Funded!</span>
                </div>
              )}

              <h3 className="text-white font-bold text-lg mb-2">Back This Campaign</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Pay directly to creator via UPI.
              </p>

              {/* UPI ID display */}
              {upiId ? (
                <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-3 mb-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Creator UPI ID</p>
                    <p className="text-white text-sm font-bold">{upiId}</p>
                  </div>
                  <button onClick={copyUpiId} className="text-purple-400 hover:text-purple-300 transition-colors">
                    {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4">
                  <p className="text-yellow-400 text-xs">Creator ne UPI ID add nahi ki abhi tak.</p>
                </div>
              )}

              {/* Quick Amounts */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[100, 250, 500, 1000, 2000, 5000].map((amt) => (
                  <button key={amt}
                    onClick={() => { setSelectedAmount(String(amt)); setCustomAmount(""); }}
                    className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                      selectedAmount === String(amt) && !customAmount
                        ? "bg-purple-600 text-white"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                    }`}>
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Custom Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">₹</span>
                  <input type="number" placeholder="Enter amount" value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(""); }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
                  />
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={() => {
                  // if (!user) { navigate("login"); return; }
                  if (!finalAmount || Number(finalAmount) <= 0) {
                    alert("select amount first!");
                    return;
                  }
                  if (!upiId) {
                    alert("Creator not added upi id. try again.");
                    return;
                  }
                  setShowPayment(true);
                  setPaymentStep(1);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 mb-3"
              >
                <FiSmartphone size={16} />
                {finalAmount ? `Pay ₹${finalAmount} via UPI` : "Pay via UPI"}
              </button>

              {!user && (
                <p className="text-xs text-gray-600 text-center mb-3">
                  <button onClick={() => navigate("login")} className="text-purple-400 hover:underline">Login</button>{" "}
                  to back this campaign
                </p>
              )}

              <button className="w-full border border-white/10 hover:border-white/20 text-gray-400 hover:text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                <FiShare2 size={16} /> Share Project
              </button>
            </div>

            {/* Campaign Info */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Campaign Details</h3>
              {[
                { label: "Category", value: campaign.category },
                { label: "Duration", value: `${campaign.duration} days` },
                { label: "Status", value: campaign.status },
                {
                  label: "Deadline",
                  value: campaign.deadline
                    ? new Date(campaign.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                    : "—",
                },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-gray-500 text-sm">{item.label}</span>
                  <span className="text-white text-sm font-medium capitalize">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* UPI PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center px-4 py-8 overflow-y-auto">
          <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl">

            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-white/5">
              <div>
                <p className="text-xs text-purple-400 uppercase tracking-widest mb-0.5">
                  {paymentStep === 1 && "Step 1 of 2"}
                  {paymentStep === 2 && "Step 2 of 2"}
                  {paymentStep === 4 && "Complete"}
                </p>
                <h3 className="text-white font-bold">
                  {paymentStep === 1 && "Scan QR to Pay"}
                  {paymentStep === 2 && "Confirm Payment"}
                  {paymentStep === 4 && "Thank You! 🎉"}
                </h3>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                <FiX size={20} />
              </button>
            </div>

            {/* STEP 1: QR */}
            {paymentStep === 1 && (
              <div className="p-6">
                <div className="text-center mb-5">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Pay Amount</p>
                  <p className="text-4xl font-black text-white">₹{finalAmount}</p>
                  <p className="text-xs text-gray-500 mt-1">to {campaign.creator?.name}</p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-2xl">
                    {qrUrl ? (
                      <img src={qrUrl} alt="UPI QR" width={200} height={200} className="rounded-xl" />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-xl">
                        <p className="text-gray-500 text-xs text-center">QR not available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* UPI ID */}
                <div className="bg-white/3 border border-white/8 rounded-xl p-3 mb-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">UPI ID</p>
                    <p className="text-white text-sm font-bold">{upiId}</p>
                  </div>
                  <button onClick={copyUpiId}
                    className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30 rounded-lg px-2 py-1">
                    {copied ? <><FiCheck size={12} /> Copied</> : <><FiCopy size={12} /> Copy</>}
                  </button>
                </div>

                {/* Instructions */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-5">
                  <p className="text-xs text-blue-400 font-semibold mb-2">How to pay:</p>
                  <ol className="text-xs text-gray-400 space-y-1.5">
                    <li>1. Open PhonePe, GPay, or Paytm</li>
                    <li>2. Scan this QR code</li>
                    <li>3. Enter ₹{finalAmount} if not auto-filled</li>
                    <li>4. Complete payment</li>
                    <li>5. Click "I've Paid" below</li>
                  </ol>
                </div>

                {/* Direct UPI */}
                {upiUrl && (
                  <a href={upiUrl}
                    className="w-full block text-center bg-white/5 border border-white/10 hover:border-purple-500/30 text-white font-semibold py-3 rounded-xl transition-colors text-sm mb-3">
                    📱 Open UPI App Directly
                  </a>
                )}

                <button onClick={() => setPaymentStep(2)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition-all">
                   I've Paid — Confirm Now
                </button>
              </div>
            )}

            {/* STEP 2: Confirm */}
            {paymentStep === 2 && (
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Payment Complete?</h3>
                <p className="text-gray-500 text-sm mb-2 leading-relaxed">
                  Did you pay <span className="text-white font-bold">₹{finalAmount}</span> to{" "}
                  <span className="text-white font-bold">{campaign.creator?.name}</span>?
                </p>
                <p className="text-xs text-gray-600 mb-6">UPI: {upiId}</p>

                <button onClick={handleConfirmPayment} disabled={confirming}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3">
                  {confirming
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><FiCheck size={16} /> Yes, Payment Done!</>
                  }
                </button>

                <button onClick={() => setPaymentStep(1)}
                  className="w-full border border-white/10 hover:border-white/20 text-gray-400 hover:text-white py-3 rounded-xl transition-colors text-sm">
                  ← Show QR Again
                </button>
              </div>
            )}

            {/* STEP 4: Success */}
            {paymentStep === 4 && (
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
                  <FiCheck className="text-green-400" size={36} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Thank You!</h3>
                <p className="text-gray-500 text-sm mb-1">You backed</p>
                <p className="text-white font-bold mb-2">{campaign.title}</p>
                <p className="text-3xl font-black text-purple-400 mb-6">₹{finalAmount}</p>

                <div className="bg-white/3 border border-white/8 rounded-xl p-4 mb-6 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">Total Raised</span>
                    <span className="text-white font-bold">${(campaign.raisedAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-500 text-sm">Progress</span>
                    <span className="text-purple-400 font-bold">{percent}%</span>
                  </div>
                  <div className="bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${Math.min(percent, 100)}%` }} />
                  </div>
                </div>

                <button onClick={closeModal}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors">
                  Done ✓
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer navigate={navigate} />
    </div>
  );
}

export default CampaignDetailPage;