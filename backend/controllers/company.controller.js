import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import saveLocalFile from "../utils/localFileStorage.js";

const useCloudinary = Boolean(process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET);

export const registerCompany = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    let company = await Company.findOne({ name: name });
    if (company) {
      return res.status(400).json({
        message: "You can't register same company",
        success: false,
      });
    }

    company = await Company.create({
      name: name,
      userId: req.id, // Logged in recruiter's ID
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to register company",
      success: false,
    });
  }
};

// Public: For students to browse all companies
export const getCompany = async (req, res) => {
  try {
    const companies = await Company.find();
    return res.status(200).json({
      companies: companies || [],
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unable to fetch companies",
      success: false,
    });
  }
};

// Protected: For recruiter to view ONLY companies registered by them
export const getAdminCompanies = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });
    return res.status(200).json({
      companies: companies || [],
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unable to fetch your companies",
      success: false,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch company details",
      success: false,
    });
  }
};

// Security Checked: Recruiter can only edit their own company!
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    const existingCompany = await Company.findById(req.params.id);
    if (!existingCompany) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // 🔒 PRIVACY & OWNERSHIP SECURITY CHECK
    if (existingCompany.userId.toString() !== req.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized! You can only edit companies registered by you.",
        success: false,
      });
    }

    const updateData = { name, description, website, location };

    if (file && file.originalname && file.buffer) {
      const fileUri = getDataUri(file);
      if (useCloudinary) {
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        updateData.logo = cloudResponse.secure_url;
      } else {
        const localPath = saveLocalFile(file, "company-logos");
        updateData.logo = `${req.protocol}://${req.get("host")}${localPath}`;
      }
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

    return res.status(200).json({
      message: "Company information updated successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unable to update company",
      success: false,
    });
  }
};
