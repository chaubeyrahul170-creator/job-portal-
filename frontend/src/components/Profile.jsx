import React, { useState } from 'react'
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Briefcase, FileText } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

// const skills = ["HTML", "CSS", "JAVASCRIPT", "REACTJS"];
const isResume = true;
const Profile = () => {
    useGetAppliedJobs();
    const [open,setOpen] = useState(false)
    const {user} = useSelector(store=>store.auth)
    return (
        <div>
            <Navbar />
            <div className='max-w-5xl mx-auto my-8 px-4'>
                {/* Profile Header Card */}
                <div className='bg-white border border-gray-200 rounded-xl shadow-lg p-8 mb-8'>
                    <div className='flex justify-between items-start gap-6'>
                        <div className='flex items-start gap-5'>
                            <Avatar className="h-28 w-28 border-4 border-indigo-100">
                                <AvatarImage src={user?.profile?.profilePhoto || "https://www.w3schools.com/howto/img_avatar.png"} />
                                <AvatarFallback>{user?.fullName?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                                <h1 className='font-bold text-3xl text-gray-900'>{user?.fullName}</h1>
                                <p className='text-gray-600 mt-1'>{user?.profile?.bio || "Add a bio to your profile"}</p>
                                <div className='mt-4 space-y-2'>
                                    <div className='flex items-center gap-3 text-gray-700'>
                                        <Mail className='w-5 h-5 text-indigo-600' />
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className='flex items-center gap-3 text-gray-700'>
                                        <Contact className='w-5 h-5 text-indigo-600' />
                                        <span>{user?.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button onClick={()=>setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white" size="lg">
                            <Pen className='w-4 h-4 mr-2' /> Edit Profile
                        </Button>
                    </div>
                </div>

                {/* Skills Card */}
                <div className='bg-white border border-gray-200 rounded-xl shadow-lg p-8 mb-8'>
                    <div className='flex items-center gap-3 mb-5'>
                        <Briefcase className='w-6 h-6 text-indigo-600' />
                        <h2 className='font-bold text-2xl text-gray-900'>Skills</h2>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        {
                            user?.profile?.skills && user?.profile?.skills.length > 0 ? 
                            user?.profile?.skills.map((item, index) => (
                                <Badge key={index} className="bg-indigo-100 text-indigo-800 px-4 py-2 text-sm">{item}</Badge>
                            )) 
                            : <span className='text-gray-500'>No skills added yet</span>
                        }
                    </div>
                </div>

                {/* Resume Card */}
                <div className='bg-white border border-gray-200 rounded-xl shadow-lg p-8 mb-8'>
                    <div className='flex items-center gap-3 mb-5'>
                        <FileText className='w-6 h-6 text-indigo-600' />
                        <h2 className='font-bold text-2xl text-gray-900'>Resume</h2>
                    </div>
                    {
                        isResume && user?.profile?.resume ? 
                        <a target="blank" href={user?.profile?.resume} className='inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold hover:underline'>
                            <FileText className='w-5 h-5' />
                            {user?.profile?.resumeOriginalName || "Download Resume"}
                        </a>
                        : <span className='text-gray-500'>No resume uploaded</span>
                    }
                </div>

                {/* Applied Jobs Card */}
                <div className='bg-white border border-gray-200 rounded-xl shadow-lg p-8'>
                    <h2 className='font-bold text-2xl text-gray-900 mb-6'>Applied Jobs</h2>
                    <AppliedJobTable />
                </div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile;
