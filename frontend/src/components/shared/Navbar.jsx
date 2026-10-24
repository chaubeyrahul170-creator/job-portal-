import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2, Briefcase, Building } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../../../utils/constant.js";
import { setUser } from "../../../redux/authSlice.js";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
    } catch (error) {
      console.log(error);
    } finally {
      // Always clear user and persisted cache from browser
      dispatch(setUser(null));
      localStorage.removeItem("persist:root");
      navigate("/login");
      toast.success("Logged out successfully");
    }
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        <div>
          <Link to="/">
            <h1 className="text-2xl font-bold text-gray-900 cursor-pointer">
              Job<span className="text-indigo-600">Portal</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <ul className="flex font-semibold items-center gap-6 text-gray-700 text-sm">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/admin/companies"
                    className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200"
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200"
                  >
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200"
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/companies"
                    className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200"
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200"
                  >
                    Browse
                  </Link>
                </li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-indigo-100 hover:border-indigo-400 transition-all">
                  <AvatarImage src={user?.profile?.profilePhoto || undefined} />
                  <AvatarFallback className="bg-indigo-600 text-white font-bold">
                    {user?.fullName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 rounded-xl shadow-xl overflow-hidden border border-gray-100">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                      <AvatarImage src={user?.profile?.profilePhoto || undefined} />
                      <AvatarFallback className="bg-indigo-800 text-white font-bold text-lg">
                        {user?.fullName?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 truncate">
                      <h4 className="font-bold text-base truncate">{user?.fullName}</h4>
                      <p className="text-xs text-indigo-100 capitalize">
                        {user?.role} • {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-3 space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-sm font-medium"
                    asChild
                  >
                    <Link to="/profile" className="flex items-center gap-3">
                      <User2 className="w-4 h-4" />
                      View Profile
                    </Link>
                  </Button>

                  {user?.role === "recruiter" && (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-sm font-medium"
                        asChild
                      >
                        <Link to="/admin/companies" className="flex items-center gap-3">
                          <Building className="w-4 h-4" />
                          My Companies
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-sm font-medium"
                        asChild
                      >
                        <Link to="/admin/jobs" className="flex items-center gap-3">
                          <Briefcase className="w-4 h-4" />
                          Posted Jobs
                        </Link>
                      </Button>
                    </>
                  )}

                  <div className="border-t border-gray-100 my-1"></div>

                  <Button
                    onClick={logoutHandler}
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

