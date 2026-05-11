/* global require, module */
const Campaign = require("../models/Campaign");
const User = require("../models/User");
const Payment = require("../models/Payment");  

 
const getAllCampaigns = async (req, res) => {
  try {
    const { category, search, status, page = 1, limit = 6 } = req.query;

    let filter = {};

    if (category && category !== "All Projects") {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    } else {
      filter.status = "active";
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Campaign.countDocuments(filter);

    const campaigns = await Campaign.find(filter)
      .populate("creator", "name avatar upiId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      campaigns,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 
const getFeaturedCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isFeatured: true, status: "active" })
      .populate("creator", "name avatar upiId")
      .limit(3);

    res.status(200).json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get campaign by ID
const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("creator", "name email avatar upiId")
      .populate("backers.user", "name avatar");

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
 
    const campaignObj = campaign.toObject();

   
    const creatorUser = await User.findById(campaignObj.creator._id).select("upiId name email");
    
    if (creatorUser) {
      campaignObj.creator.upiId = creatorUser.upiId || "";
    }

    res.status(200).json({ success: true, campaign: campaignObj });
  } catch (error) {
    console.error("getCampaignById error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Create campaign
const createCampaign = async (req, res) => {
  try {
    const { title, category, description, goalAmount, duration, upiId } = req.body;

    if (!title || !category || !description || !goalAmount || !duration) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const campaign = await Campaign.create({
      title,
      category,
      description,
      goalAmount: Number(goalAmount),
      duration: Number(duration),
      image,
      upiId: upiId || "",
      creator: req.user.id,
    });

    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update campaign
const updateCampaign = async (req, res) => {
  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (campaign.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this campaign" });
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete campaign
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (campaign.creator.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this campaign" });
    }

    await campaign.deleteOne();

    res.status(200).json({ success: true, message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const backCampaign = async (req, res) => {
  try {
    const { amount, donorName, donorMobile } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Valid amount do" });
    }

     
    const userId = req.user ? req.user.id : null;
    
     
    let finalDonorName = donorName;
    if (!finalDonorName) {
      finalDonorName = req.user ? req.user.name : "Anonymous Guest";
    }
 
    const newPayment = await Payment.create({
      campaign: req.params.id,
      user: userId, 
      amount: Number(amount),
      donorName: finalDonorName,
      donorMobile: donorMobile || "",
    });

     
    const updated = await Campaign.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { raisedAmount: Number(amount) },
        $push: {
          backers: {
            user: userId, // Eh null vi ja sakda hai
            amount: Number(amount),
            donorName: finalDonorName,
            donorMobile: donorMobile || "",
            backedAt: new Date(),
          },
        },
      },
      { new: true, runValidators: false }
    )
      .populate("creator", "name email upiId")
      .populate("backers.user", "name");

    if (!updated) {
      return res.status(404).json({ message: "Campaign not found" });
    }
 
    if (updated.raisedAmount >= updated.goalAmount) {
      await Campaign.findByIdAndUpdate(req.params.id, { status: "funded" });
      updated.status = "funded";
    }

 
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { backedCampaigns: updated._id },
      });
    }

    console.log(" Payment Saved! ID:", newPayment._id, "Donor:", finalDonorName);

    return res.status(200).json({
      success: true,
      message: `Successfully backed ₹${amount}!`,
      campaign: updated,
      paymentId: newPayment._id
    });
  } catch (error) {
    console.error("Back error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
 
const getMyCampaigns = async (req, res) => {
  try {
   
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

   
    const userId = req.user.id || req.user._id;

    const campaigns = await Campaign.find({ creator: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, campaigns });
  } catch (error) {
    console.error(" getMyCampaigns Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCampaigns,
  getFeaturedCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  backCampaign,
  getMyCampaigns,
};