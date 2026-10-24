import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { USER_API_END_POINT } from "../../../utils/constant.js";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../../redux/authSlice.js";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  CheckCircle2,
} from "lucide-react";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
  const location = useLocation();

  // If navigated from Signup, pre-fill with the NEW user's email and role
  const [input, setInput] = useState({
    email: location.state?.email || "",
    password: "",
    role: location.state?.role || "student",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Keep state updated if navigated from Signup
  useEffect(() => {
    if (location.state?.email) {
      setInput((prev) => ({
        ...prev,
        email: location.state.email,
        role: location.state.role || prev.role,
        password: "",
      }));
    }
  }, [location.state]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.email.trim() || !input.password || !input.role) {
      toast.error("Please enter email, password, and select your role");
      return;
    }

    const normalizedEmail = input.email.toLowerCase().trim();
    if (!emailRegex.test(normalizedEmail)) {
      toast.error("Please enter a valid email address with a domain (e.g. name@example.com)");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        {
          email: normalizedEmail,
          password: input.password,
          role: input.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        if (res.data.user?.role === "recruiter") {
          navigate("/admin/companies");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Invalid credentials");
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
      <div className="max-w-5xl mx-auto my-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-5">
          {/* Left Hero Panel */}
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 text-white flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-6">
                ✨ #1 Career & Job Platform
              </span>
              <h2 className="text-3xl font-extrabold leading-tight mb-4">
                Welcome back to your career portal.
              </h2>
              <p className="text-indigo-100 text-sm leading-relaxed mb-8">
                Log in to access verified job openings, schedule interviews, or manage company postings.
              </p>

              <div className="space-y-4 text-sm text-indigo-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>5,000+ top tech companies hiring</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Direct 1-click applications</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Live interview tracking & schedules</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 text-xs text-indigo-200">
              Trusted by 100,000+ candidates across India
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="md:col-span-3 p-8 sm:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Sign In to Your Account</h1>
              <p className="text-sm text-gray-500 mt-1">
                Select your role and enter your details to continue.
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4" autoComplete="off">
              {/* 🔒 Chrome Autofill Decoy Blocker */}
              <div className="sr-only opacity-0 h-0 overflow-hidden" aria-hidden="true">
                <input type="text" name="chrome_decoy_user" tabIndex="-1" autoComplete="off" />
                <input type="password" name="chrome_decoy_pass" tabIndex="-1" autoComplete="off" />
              </div>

              {/* Role Selection Tabs */}
              <div>
                <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                  Sign in as
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

              {/* Email Address */}
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
                    autoComplete="off"
                    className="pl-10 h-11 rounded-lg border-gray-200 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label className="text-xs font-semibold text-gray-700">Password</Label>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    placeholder="Enter your password"
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

              {/* Submit Button */}
              <div className="pt-2">
                {loading ? (
                  <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all"
                  >
                    Sign In
                  </Button>
                )}
              </div>

              <p className="text-center text-sm text-gray-500 pt-2">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

