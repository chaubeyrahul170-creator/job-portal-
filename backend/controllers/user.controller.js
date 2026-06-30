import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import saveLocalFile from "../utils/localFileStorage.js";

const useCloudinary = Boolean(process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET);

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    console.log(fullName, email, phoneNumber, password, role)

    if (!fullName || !email || !phoneNumber || !role) {
      return res.status(400).json({
        message: "something is missing",
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
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with the email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });
    return res.status(201).json({
      message: "Account creted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or pssword",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "inccorect email or password",
        success: false,
      });
    }
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
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
        message: `Welcome back ${user.fullName}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
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

    // Handle profile photo upload
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

    // Handle resume upload
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
      skillsArray = skills.split(",");
    }
    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "user not found",
        success: false,
      });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

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
      message: "profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
