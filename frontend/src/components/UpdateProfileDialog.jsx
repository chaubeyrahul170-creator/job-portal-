// import { useState } from "react";
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Button } from "./ui/button";
// import { Loader2 } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { USER_API_END_POINT } from "../../utils/constant.js";
// import { setUser } from "../../redux/authSlice.js";
// import { toast } from "sonner";
// import axios from "axios";


// const UpdateProfileDialog = ({ open, setOpen }) => {
//     const [loading,setLoading] = useState(false);
//     const {user} = useSelector(store=>store.auth);

//     const [input,setInput] = useState({
//         fullName:user?.fullName || "",
//         email:user?.email || "",
//         phoneNumber:user?.phoneNumber || "",
//         bio:user?.profile?.bio || "",
//         skills:user?.profile?.skills?.map(skill=>skill) || "",
//         file:user?.profile?.resume || "",
//         profilePhoto:null


//     });
//     const dispatch = useDispatch();
//     const changeEventHandler =(e)=>{
//         setInput({...input,[e.target.name]:e.target.value})
//     }
//     const fileChangeHandler =(e)=>{
//         const file = e.target.files?.[0];
//         setInput({...input,file})
//     }
//     const profilePhotoChangeHandler =(e)=>{
//         const photo = e.target.files?.[0];
//         setInput({...input,profilePhoto:photo})
//     }
    
//     const submitHandler =async(e)=>{
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("fullName",input.fullName);
//         formData.append("email",input.email);
//         formData.append("phoneNumber",input.phoneNumber);
//         formData.append("bio",input.bio);
//         formData.append("skills",input.skills);
//         if(input.file){
//             formData.append("file",input.file);
//         }
//         if(input.profilePhoto){
//             formData.append("profilePhoto",input.profilePhoto);
//         }
//         try{
//             setLoading(true)
// const res = await axios.post(`${USER_API_END_POINT}/profile/update`,formData,{
//     headers:{
//         'Content-Type':'multipart/form-data'
//     },
//     withCredentials:true
// });
// if(res.data.success){
// dispatch(setUser(res.data.user));
// toast.success(res.data.message)
// }
//         }catch(error){
// console.log(error);
// toast.error(error.response.data.message)

//         }finally{
//             setLoading(false)
//         }
//         setOpen(false)
//         console.log(input);
//     }
//     return (
//         <div>
//             <Dialog open={open}>
//                 <DialogContent className="sm:max-w-[425px]" onInteractOutside={()=>setOpen(false)}>
//                     <DialogHeader>
//                         <DialogTitle>Update Profile</DialogTitle>
//                     </DialogHeader>
//                     <form onSubmit={submitHandler}>
//                         <div className="grid gap-4 py-4">
//                             <div className="grid grid-cols-4 items-center gap-4">
//                                 <Label htmlFor="name" className="text-right">Name</Label>
//                                 <Input id="name" name="fullName" value={input.fullName} onChange={changeEventHandler} className="col-span-3" />
//                             </div>
//                             <div className="grid grid-cols-4 items-center gap-4">
//                                 <Label htmlFor="email" className="text-right">Email</Label>
//                                 <Input id="email" name="email" className="col-span-3" value={input.email} onChange={changeEventHandler} />
//                             </div>
//                             <div className="grid grid-cols-4 items-center gap-4">
//                                 <Label htmlFor="number" className="text-right">Number</Label>
//                                 <Input id="number" name="phoneNumber" className="col-span-3" value={input.phoneNumber} onChange={changeEventHandler}/>
//                             </div>
//                             <div className="grid grid-cols-4 items-center gap-4">
//                                 <Label htmlFor="bio" className="text-right">Bio</Label>
//                                 <Input id="bio" name="bio" className="col-span-3" value={input.bio} onChange={changeEventHandler} />
//                             </div>
//                             <div className="grid grid-cols-4 items-center gap-4">
//                                 <Label htmlFor="skills" className="text-right">Skills</Label>
//                                 <Input id="skills" name="skills" className="col-span-3" value={input.skills} onChange={changeEventHandler} />
//                             </div>
//                             <div className="grid grid-cols-4 items-center gap-4">
//                                 <Label htmlFor="profilePhoto" className="text-right">Profile Photo</Label>
//                                 <Input id="profilePhoto" name="profilePhoto" type="file" accept="image/*" className="col-span-3"  onChange={profilePhotoChangeHandler} />
//                             </div>
//                             <div className="grid grid-cols-4 items-center gap-4">
//                                 <Label htmlFor="file" className="text-right">Resume</Label>
//                                 <Input id="file" name="file" type="file" className="col-span-3"  onChange={fileChangeHandler} />
//                             </div>
//                                 </div>
//                                 <DialogFooter>
//                                     {
//                                         loading ? <Button className="w-full my-4"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait</Button>:<Button type="submit">Update</Button>
//                                     }
//                                 </DialogFooter>
//                             </form>
//                         </DialogContent>
//                     </Dialog>
//                 </div>
                
//                 )
// }
// export default  UpdateProfileDialog;

















import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "../../utils/constant.js";
import { setUser } from "../../redux/authSlice.js";
import { toast } from "sonner";
import axios from "axios";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const isRecruiter = user?.role === "recruiter";

  const [input, setInput] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: Array.isArray(user?.profile?.skills)
      ? user.profile.skills.join(", ")
      : user?.profile?.skills || "",
    file: null,
    profilePhoto: null,
  });

  useEffect(() => {
    if (user) {
      setInput({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: Array.isArray(user?.profile?.skills)
          ? user.profile.skills.join(", ")
          : user?.profile?.skills || "",
        file: null,
        profilePhoto: null,
      });
    }
  }, [user, open]);

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const profilePhotoChangeHandler = (e) => {
    const photo = e.target.files?.[0];
    setInput({ ...input, profilePhoto: photo });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);

    if (!isRecruiter) {
      formData.append("skills", input.skills);
      if (input.file) {
        formData.append("file", input.file);
      }
    }

    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Profile updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[480px]"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isRecruiter ? "Update Recruiter Profile" : "Update Profile"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                name="fullName"
                value={input.fullName}
                onChange={changeEventHandler}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                className="col-span-3"
                value={input.email}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right text-sm font-medium">
                Phone
              </Label>
              <Input
                id="number"
                name="phoneNumber"
                className="col-span-3"
                value={input.phoneNumber}
                onChange={changeEventHandler}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right text-sm font-medium">
                {isRecruiter ? "Role / Bio" : "Bio"}
              </Label>
              <Input
                id="bio"
                name="bio"
                className="col-span-3"
                value={input.bio}
                onChange={changeEventHandler}
                placeholder={
                  isRecruiter
                    ? "e.g. Senior Talent Acquisition Specialist"
                    : "e.g. Full-stack Developer passionate about React"
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="profilePhoto"
                className="text-right text-sm font-medium"
              >
                Photo
              </Label>
              <Input
                id="profilePhoto"
                name="profilePhoto"
                type="file"
                accept="image/*"
                className="col-span-3"
                onChange={profilePhotoChangeHandler}
              />
            </div>

            {/* ONLY FOR STUDENTS: Skills & Resume */}
            {!isRecruiter && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="skills"
                    className="text-right text-sm font-medium"
                  >
                    Skills
                  </Label>
                  <Input
                    id="skills"
                    name="skills"
                    className="col-span-3"
                    value={input.skills}
                    onChange={changeEventHandler}
                    placeholder="HTML, CSS, React, Node.js"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="file"
                    className="text-right text-sm font-medium"
                  >
                    Resume (PDF)
                  </Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="col-span-3"
                    onChange={fileChangeHandler}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            {loading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;

