/* global require, module */
const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
  { 
    title: {
      type: String,
      required: [true, "Campaign title is required"],
      trim: true,
    },

   
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Art & Installations",
        "Sustainable Housing",
        "Urban Revitalization",
        "Tech-Infused Spaces",
        "Community Hubs",
        "Eco-Resorts",
        "Public Art",
      ],
    },
 
    description: {
      type: String,
      required: [true, "Description is required"],
    },

    
    goalAmount: {
      type: Number,
      required: [true, "Goal amount is required"],
      min: [100, "Goal must be at least 100"],
    },

    
    raisedAmount: {
      type: Number,
      default: 0,
    },

     
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 day"],
    },

 
    deadline: {
      type: Date,
    },

    image: {
      type: String,
      default: "",
    },

 
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "active", "funded", "expired", "cancelled"],
      default: "active",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

 
    isFeatured: {
      type: Boolean,
      default: false,
    },

   
    backers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
        amount: Number,
        backedAt: {
          type: Date,
          default: Date.now,
        },
        upiId: {
         type: String,
         default: "",
         trim: true,
       },
      },
    ],
  },
  {
    timestamps: true,
  }
);
 
CampaignSchema.virtual("fundedPercent").get(function () {
  if (this.goalAmount === 0) return 0;
  return Math.round((this.raisedAmount / this.goalAmount) * 100);
});

 
CampaignSchema.virtual("daysLeft").get(function () {
  if (!this.deadline) return 0;
  const today = new Date();
  const diff = this.deadline - today;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

 
CampaignSchema.set("toJSON", { virtuals: true });
CampaignSchema.set("toObject", { virtuals: true });
 
CampaignSchema.pre("save", function () {
  if (this.isNew) {
    const start = new Date();
    start.setDate(start.getDate() + this.duration);
    this.deadline = start;
  }
  
});

module.exports = mongoose.model("Campaign", CampaignSchema);