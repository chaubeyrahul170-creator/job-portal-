import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";

// Admin: Post job (With Ownership Verification)
export const postJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
    const userId = req.id;

    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // 🔒 OWNERSHIP SECURITY CHECK: Verify recruiter owns this company!
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    if (company.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized! You can only post jobs for companies registered by you.",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: typeof requirements === "string" ? requirements.split(",") : requirements,
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: Number(experience) || 0,
      position: Number(position) || 1,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create job",
      success: false,
    });
  }
};

// Student / Public: Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs: jobs || [],
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch jobs",
      success: false,
    });
  }
};

// Student / Public: Get job by id
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate({ path: "applications" })
      .populate({ path: "company" });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch job",
      success: false,
    });
  }
};

// Admin: Get jobs created ONLY by this logged-in admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs: jobs || [],
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch admin jobs",
      success: false,
    });
  }
};

