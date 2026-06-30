import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../../../utils/constant.js";
import { setUser } from "../../../redux/authSlice.js";



const Navbar = () => {
  // let [user, setUser] = useState(false);
const {user}=useSelector(store=>store.auth);
const dispatch = useDispatch();
const navigate = useNavigate();
 const logoutHandler = async()=>{
  try{
const res = await axios.get(`${USER_API_END_POINT}/logout`,{withCredentials:true});
if(res.data.success){
  dispatch(setUser(null));
  navigate("/");
  toast.success(res.data.message)
}
  }catch(error){
    console.log(error);
    toast.error(error.response.data.message)
    
  }
 }
  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Job<span className="text-indigo-600">Portal</span>
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-semibold items-center gap-8 text-gray-700">
          {
            user && user.role === "recruiter" ?(
              <>
               <li><Link to="/admin/companies" className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200">Companies</Link></li>
               <li><Link to="/admin/jobs" className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200">Jobs</Link></li>
              </>
            ):(
              <>
              <li><Link to="/" className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200">Home</Link></li>
              <li><Link to="/jobs" className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200">Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200">Companies</Link></li>
              <li><Link to="/browse" className="hover:text-indigo-600 hover:underline underline-offset-4 transition-all duration-200">Browse</Link></li>
              </>
            )
          }
           
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
             <Link to="/login"> <Button variant="outline">Login</Button></Link>
             <Link to="/signup"><Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Signup
              </Button></Link> 
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.profile?.profilePhoto || undefined} />
                  <AvatarFallback>{user?.fullName?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0 rounded-lg shadow-xl overflow-hidden">
                {/* Profile Section */}
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16 border-4 border-white">
                      <AvatarImage src={user?.profile?.profilePhoto || undefined} />
                      <AvatarFallback className="text-lg font-bold">{user?.fullName?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{user?.fullName}</h4>
                      <p className="text-sm text-indigo-100 line-clamp-2">
                        {user?.profile?.bio || "No bio added"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Menu Section */}
                <div className="p-4 space-y-2">
                  {user && user.role === "student" && (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                      asChild
                    >
                      <Link to="/profile" className="flex items-center gap-3">
                        <User2 className="w-5 h-5" />
                        View Profile
                      </Link>
                    </Button>
                  )}
                  
                  <div className="border-t border-gray-200"></div>
                  
                  <Button 
                    onClick={logoutHandler} 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:bg-red-50 font-medium"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
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
