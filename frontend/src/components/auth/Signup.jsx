import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../../../utils/constant.js";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/authSlice.js";
import {
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  CheckCircle2,
  Upload,
} from "lucide-react";

// Strict email regex: requires name@domain.tld (e.g. name@example.com)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Strict Indian mobile phone regex: 10 digits
const phoneRegex = /^[0-9]{10}$/;

const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    file: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Reset form inputs on mount
  useEffect(() => {
    setInput({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "student",
      file: null,
    });
  }, []);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // 🔒 1. Check all required fields
    if (
      !input.fullName.trim() ||
      !input.email.trim() ||
      !input.phoneNumber.trim() ||
      !input.password ||
      !input.role
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // 🔒 2. Strict Email Validation
    const normalizedEmail = input.email.toLowerCase().trim();
    if (!emailRegex.test(normalizedEmail)) {
      toast.error("Invalid email! Email must include a domain extension (e.g. name@example.com)");
      return;
    }

    // 🔒 3. Strict Phone Number Validation (10 digits)
    const trimmedPhone = input.phoneNumber.trim();
    if (!phoneRegex.test(trimmedPhone)) {
      toast.error("Invalid phone! Please enter a valid 10-digit mobile number");
      return;
    }

    // 🔒 4. Password Minimum Length
    if (input.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", input.fullName.trim());
    formData.append("email", normalizedEmail);
    formData.append("phoneNumber", trimmedPhone);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully! Please login.");
        // Forward new account's email and role directly to Login page!
        navigate("/login", {
          state: {
            email: normalizedEmail,
            role: input.role,
          },
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/60">
      <Navbar />
      <div className="max-w-5xl mx-auto my-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-5">
          {/* Left Hero Panel */}
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 text-white flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-6">
                🚀 Fast-Track Your Career
              </span>
              <h2 className="text-3xl font-extrabold leading-tight mb-4">
                Join India's Top Job Network.
              </h2>
              <p className="text-indigo-100 text-sm leading-relaxed mb-8">
                Create a free account as a candidate to get hired by top companies, or as an employer to find the best talent.
              </p>

              <div className="space-y-4 text-sm text-indigo-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Free registration & profile setup</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Verified recruiters & MNC openings</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Smart bookmarking & interview schedules</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 text-xs text-indigo-200">
              100% Free for candidates • Secure & Private
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="md:col-span-3 p-8 sm:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
              <p className="text-sm text-gray-500 mt-1">
                Fill in your details to start your journey.
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4" autoComplete="off">
              {/* Chrome Autofill Decoy Stopper */}
              <div className="sr-only opacity-0 h-0 overflow-hidden" aria-hidden="true">
                <input type="text" name="chrome_decoy_user" tabIndex="-1" autoComplete="off" />
                <input type="password" name="chrome_decoy_pass" tabIndex="-1" autoComplete="off" />
              </div>

              {/* Role Selection Tabs */}
              <div>
                <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                  I want to join as a
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInput({ ...input, role: "student" })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                      input.role === "student"
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-sm ring-2 ring-indigo-600/20"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Job Seeker</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInput({ ...input, role: "recruiter" })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                      input.role === "recruiter"
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-sm ring-2 ring-indigo-600/20"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Recruiter</span>
                  </button>
                </div>
              </div>

              {/* Full Name Field */}
              <div>
                <Label className="text-xs font-semibold text-gray-700">Full Name</Label>
                <div className="relative mt-1">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <Input
                    type="text"
                    name="fullName"
                    value={input.fullName}
                    onChange={changeEventHandler}
                    placeholder="e.g. Rahul Sharma"
                    autoComplete="off"
                    className="pl-10 h-11 rounded-lg border-gray-200 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              {/* Email & Phone in 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-700">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <Input
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={changeEventHandler}
                      placeholder="name@example.com"
                      autoComplete="new-email"
                      className="pl-10 h-11 rounded-lg border-gray-200 focus:border-indigo-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-700">Phone Number (10 digits)</Label>
                  <div className="relative mt-1">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <Input
                      type="tel"
                      name="phoneNumber"
                      maxLength={10}
                      value={input.phoneNumber}
                      onChange={changeEventHandler}
                      placeholder="9876543210"
                      autoComplete="off"
                      className="pl-10 h-11 rounded-lg border-gray-200 focus:border-indigo-600"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Field with Toggle & Anti-Autofill */}
              <div>
                <Label className="text-xs font-semibold text-gray-700">Password (Min. 6 characters)</Label>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className="pl-10 pr-10 h-11 rounded-lg border-gray-200 focus:border-indigo-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div>
                <Label className="text-xs font-semibold text-gray-700 block mb-1">
                  Profile Photo (Optional)
                </Label>
                <div className="flex items-center gap-4">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Avatar Preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-600 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-50 border border-dashed border-indigo-200 flex items-center justify-center text-indigo-400">
                      <User className="w-6 h-6" />
                    </div>
                  )}

                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-xl p-3 text-sm text-gray-600 hover:bg-indigo-50/30 transition-all">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-xs sm:text-sm">
                      {input.file ? input.file.name : "Upload your profile photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={changeFileHandler}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                {loading ? (
                  <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating your account...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all"
                  >
                    Create Account
                  </Button>
                )}
              </div>

              <p className="text-center text-sm text-gray-500 pt-2">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

