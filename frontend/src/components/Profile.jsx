import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Contact,
  Mail,
  Pen,
  Briefcase,
  FileText,
  Building2,
  Users,
  PlusCircle,
  ExternalLink,
  Bookmark,
  Trash2,
  MapPin,
} from "lucide-react";
import { Badge } from "./ui/badge";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useDispatch, useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { useNavigate } from "react-router-dom";
import { toggleSaveJob } from "../../redux/jobSlice.js";
import { toast } from "sonner";

const Profile = () => {
  useGetAppliedJobs();
  useGetAllCompanies();
  useGetAllAdminJobs();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("applied");
  const { user } = useSelector((store) => store.auth);
  const { savedJobs, allAdminJobs } = useSelector((store) => store.job);
  const { companies } = useSelector((store) => store.company);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isRecruiter = user?.role === "recruiter";

  const totalApplicants =
    allAdminJobs?.reduce(
      (acc, job) => acc + (job?.applications?.length || 0),
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      <Navbar />

      <div className="max-w-5xl mx-auto my-8 px-4">
        {/* Profile Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left w-full sm:w-auto">
              <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-indigo-100 shadow-sm">
                <AvatarImage
                  src={
                    user?.profile?.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.fullName || "User"
                    )}&background=6366f1&color=fff&size=128`
                  }
                />
                <AvatarFallback className="text-2xl font-bold bg-indigo-600 text-white">
                  {user?.fullName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h1 className="font-bold text-2xl md:text-3xl text-gray-900">
                    {user?.fullName}
                  </h1>
                  <Badge
                    className={
                      isRecruiter
                        ? "bg-purple-100 text-purple-800 border-purple-200 font-semibold"
                        : "bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold"
                    }
                  >
                    {isRecruiter ? "Recruiter / Employer" : "Job Seeker"}
                  </Badge>
                </div>

                <p className="text-gray-600 mt-2 text-sm md:text-base max-w-2xl">
                  {user?.profile?.bio ||
                    (isRecruiter
                      ? "Hiring partner managing recruitment and company talent pipelines."
                      : "Add a bio to showcase your skills and interests.")}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 md:gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Contact className="w-4 h-4 text-indigo-600" />
                    <span>{user?.phoneNumber || "No phone added"}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white self-center sm:self-start w-full sm:w-auto"
              size="default"
            >
              <Pen className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          </div>
        </div>

        {/* ==================== RECRUITER VIEW ==================== */}
        {isRecruiter ? (
          <div>
            {/* Executive Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">
                    My Registered Companies
                  </p>
                  <h3 className="text-3xl font-extrabold mt-1">
                    {companies?.length || 0}
                  </h3>
                  <p className="text-xs text-indigo-200 mt-1">Managed by you</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">
                    My Job Postings
                  </p>
                  <h3 className="text-3xl font-extrabold mt-1">
                    {allAdminJobs?.length || 0}
                  </h3>
                  <p className="text-xs text-blue-200 mt-1">Active recruitment listings</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">
                    Total Applicants
                  </p>
                  <h3 className="text-3xl font-extrabold mt-1">
                    {totalApplicants}
                  </h3>
                  <p className="text-xs text-emerald-200 mt-1">Candidate submissions</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Recruiter Section: My Companies */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" /> My Companies
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Only you have access to manage and post jobs for these companies
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/admin/companies/create")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 self-start sm:self-auto"
                  size="sm"
                >
                  <PlusCircle className="w-4 h-4" /> Add Company
                </Button>
              </div>

              {companies && companies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companies.map((company) => (
                    <div
                      key={company._id}
                      className="border border-gray-200 hover:border-indigo-300 rounded-xl p-5 transition-all hover:shadow-sm bg-gray-50/50 flex items-start gap-4"
                    >
                      <Avatar className="w-14 h-14 rounded-lg border bg-white flex-shrink-0">
                        <AvatarImage src={company.logo} alt={company.name} />
                        <AvatarFallback className="font-bold text-indigo-600 bg-indigo-50">
                          {company.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg truncate">
                          {company.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {company.location || "Location not set"}
                        </p>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1 mt-1 truncate max-w-full"
                          >
                            <span className="truncate">{company.website}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        )}
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/companies/${company._id}`)}
                            className="text-xs h-8 text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                          >
                            Edit Company
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-700 text-base">
                    No companies registered yet
                  </h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto mt-1 mb-4">
                    Register your company profile to start posting jobs and receiving applications.
                  </p>
                  <Button
                    onClick={() => navigate("/admin/companies/create")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    size="sm"
                  >
                    Register Company
                  </Button>
                </div>
              )}
            </div>

            {/* Recruiter Section: My Posted Jobs */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" /> My Job Postings
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Jobs posted by your recruiter account with applicant management
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/admin/jobs/create")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 self-start sm:self-auto"
                  size="sm"
                >
                  <PlusCircle className="w-4 h-4" /> Post New Job
                </Button>
              </div>

              {allAdminJobs && allAdminJobs.length > 0 ? (
                <div className="space-y-3">
                  {allAdminJobs.map((job) => (
                    <div
                      key={job._id}
                      className="border border-gray-200 hover:border-indigo-300 rounded-xl p-4 transition-all hover:shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30"
                    >
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-600">
                          <span className="font-semibold text-indigo-700">
                            {job?.company?.name || "Company"}
                          </span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.salary} LPA</span>
                          <span>•</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                            {job.jobType}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end md:self-auto">
                        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 font-semibold px-3 py-1 text-xs">
                          {job?.applications?.length || 0} Applicants
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                          className="text-xs h-8 bg-white hover:bg-indigo-50 border-gray-300 hover:border-indigo-300"
                        >
                          View Applicants
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-700 text-base">
                    No jobs posted yet
                  </h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto mt-1 mb-4">
                    Create your first job listing to reach thousands of candidates.
                  </p>
                  <Button
                    onClick={() => navigate("/admin/jobs/create")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    size="sm"
                  >
                    Post a Job
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ==================== STUDENT / JOB SEEKER VIEW ==================== */
          <div>
            {/* Skills Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-xl text-gray-900">Key Skills</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {user?.profile?.skills && user?.profile?.skills.length > 0 ? (
                  user?.profile?.skills.map((item, index) => (
                    <Badge
                      key={index}
                      className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 text-sm font-medium"
                    >
                      {item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm italic">
                    No skills added yet. Click 'Edit Profile' to add your skills.
                  </span>
                )}
              </div>
            </div>

            {/* Resume Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-xl text-gray-900">Resume / CV</h2>
              </div>
              {user?.profile?.resume ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {user?.profile?.resumeOriginalName || "Candidate Resume.pdf"}
                      </p>
                      <p className="text-xs text-gray-500">Uploaded Resume</p>
                    </div>
                  </div>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={user?.profile?.resume}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                  >
                    View / Download
                  </a>
                </div>
              ) : (
                <div className="text-gray-400 text-sm italic">
                  No resume uploaded yet. Click 'Edit Profile' to upload your resume.
                </div>
              )}
            </div>

            {/* Interactive Tabs: Applied Jobs vs Saved Jobs */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("applied")}
                  className={`text-lg font-bold pb-2 transition-all relative ${
                    activeTab === "applied"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Applied Jobs
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("saved")}
                  className={`text-lg font-bold pb-2 transition-all relative flex items-center gap-2 ${
                    activeTab === "saved"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Saved Jobs
                  {savedJobs?.length > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                      {savedJobs.length}
                    </span>
                  )}
                </button>
              </div>

              {activeTab === "applied" ? (
                <div>
                  <AppliedJobTable />
                </div>
              ) : (
                <div>
                  {savedJobs && savedJobs.length > 0 ? (
                    <div className="space-y-4">
                      {savedJobs.map((job) => (
                        <div
                          key={job?._id}
                          className="border border-gray-200 hover:border-indigo-300 rounded-xl p-5 transition-all hover:shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/40"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-indigo-600">
                                {job?.company?.name || "Company"}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {job?.location}
                              </span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {job?.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {job?.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                                {job?.position || 1} Positions
                              </Badge>
                              <Badge className="bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                                {job?.jobType}
                              </Badge>
                              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                                {job?.salary} LPA
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 self-end md:self-auto">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                dispatch(toggleSaveJob(job));
                                toast.info(`Removed "${job?.title}" from saved jobs`);
                              }}
                              className="text-red-600 hover:bg-red-50 border-red-200 text-xs h-9 flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => navigate(`/description/${job?._id}`)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-700 text-base">
                        No saved jobs yet
                      </h3>
                      <p className="text-gray-500 text-sm max-w-md mx-auto mt-1 mb-4">
                        When you find jobs you like, click the bookmark icon or "Save For Later" button to access them here.
                      </p>
                      <Button
                        onClick={() => navigate("/jobs")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        size="sm"
                      >
                        Explore Jobs
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;

