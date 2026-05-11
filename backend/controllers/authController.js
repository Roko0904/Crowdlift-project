/* global require, module, process */
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

// Initialize Google Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

 
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        upiId: user.upiId || "",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: error.message });
  }
};

 
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        upiId: user.upiId || "", 
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token missing" });
    }

    // Verify Google Token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
   
      const randomPassword = Math.random().toString(36).slice(-10) + "A1@";
      
      user = await User.create({
        name: name,
        email: email,
        password: randomPassword,
        avatar: picture,
      });
    }

    const appToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        upiId: user.upiId || "",
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error.message);
    res.status(500).json({ message: "Google Authentication failed" });
  }
};

 
const githubLogin = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "GitHub code missing" });
    }

 
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.status(400).json({ message: "Invalid GitHub code" });
    }

 
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUser = await userResponse.json();

   
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emails = await emailResponse.json();
    const primaryEmail = emails.find((e) => e.primary)?.email || emails[0]?.email;

    if (!primaryEmail) {
      return res.status(400).json({ message: "No email associated with this GitHub account" });
    }

    
    let user = await User.findOne({ email: primaryEmail });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + "A1@";
      user = await User.create({
        name: githubUser.name || githubUser.login,
        email: primaryEmail,
        password: randomPassword,
        avatar: githubUser.avatar_url,
      });
    }

    const appToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        upiId: user.upiId || "",
      },
    });
  } catch (error) {
    console.error("GitHub Login Error:", error.message);
    res.status(500).json({ message: "GitHub Authentication failed" });
  }
};
 
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "backedCampaigns",
      "title image raisedAmount"
    );
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
const updateProfile = async (req, res) => {
  try {
    const { name, avatar, upiId } = req.body;

    console.log("Updating profile:", { name, upiId });

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (upiId !== undefined) user.upiId = upiId.trim();

    await user.save();

    console.log("Saved successfully - upiId:", user.upiId);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        upiId: user.upiId,
      },
    });
  } catch (error) {
    console.error("UpdateProfile error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

 
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password galat hai!" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  register, 
  login, 
  googleLogin, 
  githubLogin, 
  getMe, 
  updateProfile, 
  updatePassword 
};