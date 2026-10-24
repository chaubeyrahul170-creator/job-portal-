import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Student: Apply for a job
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: false,
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to apply for job",
      success: false,
    });
  }
};

// Student: Get all jobs applied by logged-in student
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });

    return res.status(200).json({
      application: application || [],
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch applied jobs",
      success: false,
    });
  }
};

// Recruiter: View applicants for a specific job (Secured: Only recruiter who posted the job)
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // 🔒 PRIVACY SECURITY CHECK: Recruiter can only view applicants of their own jobs
    if (job.created_by.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized! You can only view applicants for jobs posted by you.",
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
      message: "Failed to fetch applicants",
      success: false,
    });
  }
};

// Recruiter: Update applicant status & schedule interview (Secured: Only recruiter who posted the job)
export const updateStatus = async (req, res) => {
  try {
    const { status, interview } = req.body;
    const applicationId = req.params.id;
    const userId = req.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    const normalizedStatus = status.toLowerCase();
    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid status value",
        success: false,
      });
    }

    const application = await Application.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    // 🔒 PRIVACY SECURITY CHECK: Ensure logged-in recruiter posted the job
    if (application.job && application.job.created_by.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized! You can only manage applicants for jobs posted by you.",
        success: false,
      });
    }

    application.status = normalizedStatus;
    if (!application.interview) {
      application.interview = {};
    }
    if (interview && typeof interview === "object") {
      application.interview.date = interview.date || application.interview.date;
      application.interview.time = interview.time || application.interview.time;
      application.interview.venue = interview.venue || application.interview.venue;
      application.interview.mode = interview.mode || application.interview.mode;
      application.interview.notes = interview.notes || application.interview.notes;
    }

    await application.save();
    return res.status(200).json({
      message: "Status updated successfully",
      success: true,
      application,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update status",
      success: false,
    });
  }
};

