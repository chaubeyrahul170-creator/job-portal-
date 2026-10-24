import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import saveLocalFile from "../utils/localFileStorage.js";

const useCloudinary = Boolean(process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET);

// 🔒 Strict Email Regex: Requires username@domain.tld (e.g. name@example.com)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// 🔒 Strict Phone Regex: Exactly 10 numeric digits
const phoneRegex = /^[0-9]{10}$/;

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        success: false,
      });
    }

    const trimmedName = fullName.trim();
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedPhone = phoneNumber.toString().trim();

    // 🔒 1. Strict Email Format Check (Must have .com, .in, etc.)
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email! Email must include a valid domain extension (e.g. name@example.com)",
        success: false,
      });
    }

    // 🔒 2. Strict Phone Number Check (Must be 10 digits)
    if (!phoneRegex.test(trimmedPhone)) {
      return res.status(400).json({
        message: "Invalid phone number! Please enter a valid 10-digit mobile number",
        success: false,
      });
    }

    // 🔒 3. Password Minimum Length Check
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    // 🔒 4. Role Check
    if (!["student", "recruiter"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role selected. Please choose 'student' or 'recruiter'",
        success: false,
      });
    }

    // 🔒 5. Duplicate Email Check
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists",
        success: false,
      });
    }

    const file = req.file;
    let profilePhotoUrl = "";
    if (file && file.originalname && file.buffer) {
      const fileUri = getDataUri(file);
      if (useCloudinary) {
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        profilePhotoUrl = cloudResponse.secure_url;
      } else {
        const localPath = saveLocalFile(file, "profiles");
        profilePhotoUrl = `${req.protocol}://${req.get("host")}${localPath}`;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName: trimmedName,
      email: normalizedEmail,
      phoneNumber: trimmedPhone,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });

    return res.status(201).json({
      message: "Account created successfully. Please login to continue.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create account. Please try again.",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Please enter your email, password, and select your role",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email format. Please enter a valid email address (e.g. name@example.com)",
        success: false,
      });
    }

    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: `Account is registered as a ${user.role === "recruiter" ? "Recruiter" : "Job Seeker"}. Please switch to the correct role tab.`,
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    const isProduction = process.env.NODE_ENV === "production";
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        path: "/",
      })
      .json({
        message: `Welcome back, ${user.fullName}!`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to login. Please try again.",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to logout",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;

    const profilePhotoFile = req.files?.profilePhoto?.[0];
    const resumeFile = req.files?.file?.[0];

    let profilePhotoUrl = null;
    let resumeUrl = null;
    let resumeOriginalName = null;

    if (profilePhotoFile && profilePhotoFile.originalname && profilePhotoFile.buffer) {
      const fileUri = getDataUri(profilePhotoFile);
      if (useCloudinary) {
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        profilePhotoUrl = cloudResponse.secure_url;
      } else {
        const localPath = saveLocalFile(profilePhotoFile, "profiles");
        profilePhotoUrl = `${req.protocol}://${req.get("host")}${localPath}`;
      }
    }

    if (resumeFile && resumeFile.originalname && resumeFile.buffer) {
      const fileUri = getDataUri(resumeFile);
      if (useCloudinary) {
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        resumeUrl = cloudResponse.secure_url;
      } else {
        const localPath = saveLocalFile(resumeFile, "resumes");
        resumeUrl = `${req.protocol}://${req.get("host")}${localPath}`;
      }
      resumeOriginalName = resumeFile.originalname;
    }

    let skillsArray;
    if (skills) {
      skillsArray = typeof skills === "string" ? skills.split(",").map(s => s.trim()).filter(Boolean) : skills;
    }
    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (fullName) user.fullName = fullName.trim();
    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({
          message: "Please enter a valid email address with a domain",
          success: false,
        });
      }
      user.email = normalizedEmail;
    }
    if (phoneNumber) {
      const trimmedPhone = phoneNumber.toString().trim();
      if (!phoneRegex.test(trimmedPhone)) {
        return res.status(400).json({
          message: "Please enter a valid 10-digit mobile number",
          success: false,
        });
      }
      user.phoneNumber = trimmedPhone;
    }
    if (bio !== undefined) user.profile.bio = bio;
    if (skillsArray) user.profile.skills = skillsArray;

    if (profilePhotoUrl) user.profile.profilePhoto = profilePhotoUrl;
    if (resumeUrl) {
      user.profile.resume = resumeUrl;
      user.profile.resumeOriginalName = resumeOriginalName;
    }

    await user.save();
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update profile",
      success: false,
    });
  }
};

