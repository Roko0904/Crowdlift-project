/* global require, module */
 const express = require("express");
const router = express.Router();
const {
  getAllCampaigns,
  getFeaturedCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  backCampaign,
  getMyCampaigns,
} = require("../controllers/campaignController");
const { protect,optionalAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

 
router
  .route("/")
  .get(getAllCampaigns)
  .post(protect, upload.single("image"), createCampaign);

 
router.get("/featured", getFeaturedCampaigns);

 
router.get("/my", protect, getMyCampaigns);

 
router
  .route("/:id")
  .get(getCampaignById)
  .put(protect, upload.single("image"), updateCampaign)
  .delete(protect, deleteCampaign);

 
router.post("/:id/back", optionalAuth, backCampaign);

module.exports = router;