// import axios from "axios";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import Navbar from "./shared/Navbar";
// import { useParams, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setSingleJob } from "../../redux/jobSlice";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { Application_API_END_POINT, JOB_API_END_POINT } from "../../utils/constant.js";
// import { MapPin, Briefcase, DollarSign, Users, Calendar, Clock } from "lucide-react";

// const JobDescription = () => {
//     const {singleJob}= useSelector(store=>store.job);
//     const {user} = useSelector(store=>store.auth)
//     const location = useLocation();
//     const params = useParams();
//     const jobId = location.state?.jobId || params.id;
//     const applicationForUser = singleJob?.applications?.find(application => {
//       const applicantId = application?.applicant?._id || application?.applicant;
//       return applicantId === user?._id;
//     });
//     const isIntiallyApplied=Boolean(applicationForUser);
//     const [isApplied,setIsApplied] = useState(isIntiallyApplied)
//     const dispatch= useDispatch();

//     const applyJobHandler = async()=>{
//         try{
//   const res = await axios.get(`${Application_API_END_POINT}/apply/${jobId}`,{withCredentials:true})
//   if(res.data.success){
//     setIsApplied(true)
//     const updateSinglejob = {...singleJob,applications:[...singleJob.applications,{applicant:user?._id,status:'pending'}]};
//     dispatch(setSingleJob(updateSinglejob))
//     toast.success(res.data.message)
//   }
//         }catch(error){
//             console.log(error);
//             toast.error(error.response?.data?.message || "Unable to apply")
            
//         }
//     }
//     useEffect(()=>{
//         const fetchSingleJob = async () =>{
//             try{
//  const res = await axios(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
//  if(res.data.success){  
//     dispatch(setSingleJob(res.data.job))
//     setIsApplied(res.data.job.applications?.some(application=>{
//       const applicantId = application?.applicant?._id || application?.applicant;
//       return applicantId === user?._id;
//     }))
//  }
//             }catch(error){
//                 console.log(error);
                
//             }
//         }
//         if(jobId){
//           fetchSingleJob();
//         }
//     },[jobId,dispatch,user?._id])
//     return (
//         <div>
//             <Navbar />
//             <div className="max-w-5xl mx-auto my-10 px-4">
//                 {/* Job Header Card */}
//                 <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
//                     <div className="flex items-start justify-between gap-6">
//                         <div className="flex-1">
//                             <h1 className="font-bold text-3xl text-gray-900 mb-3">{singleJob?.title}</h1>
//                             <div className="flex flex-wrap gap-2">
//                                 <Badge className={'text-indigo-700 font-bold bg-indigo-50'} variant="ghost">
//                                     <Briefcase className="w-4 h-4 mr-1" /> {singleJob?.position} Positions
//                                 </Badge>
//                                 <Badge className={'text-red-600 font-bold bg-red-50'} variant="ghost">
//                                     <Clock className="w-4 h-4 mr-1" /> {singleJob?.jobType}
//                                 </Badge>
//                                 <Badge className={'text-indigo-600 font-bold bg-indigo-50'} variant="ghost">
//                                     <DollarSign className="w-4 h-4 mr-1" /> {singleJob?.salary}LPA
//                                 </Badge>
//                             </div>
//                         </div>
//                         <Button 
//                             onClick={isApplied ? null : applyJobHandler}
//                             disabled={isApplied} 
//                             className={`rounded-lg px-8 py-2 font-semibold whitespace-nowrap ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
//                         >
//                             {isApplied ? "Already Applied" : "Apply Now"}
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Application Status Card */}
//                 {applicationForUser && (
//                     <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-md p-6 mb-8">
//                         <h2 className="font-bold text-lg text-green-900 mb-3">Your Application</h2>
//                         <div className="space-y-2 text-sm">
//                             <p className="text-gray-700">Status: <span className="font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs">{applicationForUser.status?.toUpperCase()}</span></p>
//                             {applicationForUser.interview?.date && (
//                                 <div className="mt-3 pt-3 border-t border-green-200">
//                                     <p className="text-gray-700"><Calendar className="w-4 h-4 inline mr-2 text-green-600" />Interview Date: <span className="font-semibold">{applicationForUser.interview.date} {applicationForUser.interview.time || ''}</span></p>
//                                     <p className="text-gray-700"><MapPin className="w-4 h-4 inline mr-2 text-green-600" />Mode/Venue: {applicationForUser.interview.mode ? `${applicationForUser.interview.mode} • ${applicationForUser.interview.venue || 'TBA'}` : applicationForUser.interview.venue}</p>
//                                     {applicationForUser.interview?.notes && <p className="text-gray-700 mt-2"><span className="font-semibold">Notes:</span> {applicationForUser.interview.notes}</p>}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {/* Job Details Card */}
//                 <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
//                     <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-indigo-600">Job Details</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-5">
//                             <div className="flex items-start gap-3">
//                                 <Briefcase className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
//                                 <div>
//                                     <h3 className="font-semibold text-gray-700">Role</h3>
//                                     <p className="text-gray-600 mt-1">{singleJob?.title}</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-start gap-3">
//                                 <MapPin className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
//                                 <div>
//                                     <h3 className="font-semibold text-gray-700">Location</h3>
//                                     <p className="text-gray-600 mt-1">{singleJob?.location}</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-start gap-3">
//                                 <Calendar className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
//                                 <div>
//                                     <h3 className="font-semibold text-gray-700">Experience</h3>
//                                     <p className="text-gray-600 mt-1">{singleJob?.experienceLevel || 2} years</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="space-y-5">
//                             <div className="flex items-start gap-3">
//                                 <DollarSign className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
//                                 <div>
//                                     <h3 className="font-semibold text-gray-700">Salary</h3>
//                                     <p className="text-gray-600 mt-1">₹{singleJob?.salary}LPA</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-start gap-3">
//                                 <Users className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
//                                 <div>
//                                     <h3 className="font-semibold text-gray-700">Total Applicants</h3>
//                                     <p className="text-gray-600 mt-1">{singleJob?.applications?.length} applicants</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-start gap-3">
//                                 <Clock className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
//                                 <div>
//                                     <h3 className="font-semibold text-gray-700">Posted Date</h3>
//                                     <p className="text-gray-600 mt-1">{singleJob?.createdAt?.split("T")[0]}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Description Section */}
//                     <div className="mt-8 pt-8 border-t-2 border-gray-200">
//                         <h3 className="font-bold text-lg text-gray-900 mb-3">About this Job</h3>
//                         <p className="text-gray-700 leading-relaxed">{singleJob?.description}</p>
                        
//                         {/* Requirements */}
//                         {singleJob?.requirements && singleJob.requirements.length > 0 && (
//                             <div className="mt-6">
//                                 <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
//                                 <div className="flex flex-wrap gap-2">
//                                     {singleJob.requirements.map((req, index) => (
//                                         <Badge key={index} className="bg-indigo-100 text-indigo-800">{req}</Badge>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default JobDescription;





import axios from "axios";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Navbar from "./shared/Navbar";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "../../redux/jobSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Application_API_END_POINT, JOB_API_END_POINT } from "../../utils/constant.js";
import { MapPin, Briefcase, DollarSign, Users, Calendar, Clock, Building } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const location = useLocation();
  const params = useParams();
  const jobId = params.id || location.state?.jobId;

  const applicationForUser = singleJob?.applications?.find((application) => {
    const applicantId = application?.applicant?._id || application?.applicant;
    return applicantId === user?._id;
  });

  const isInitiallyApplied = Boolean(applicationForUser);
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply for this job");
      return;
    }
    if (!jobId) {
      toast.error("Invalid job ID");
      return;
    }

    try {
      const res = await axios.get(`${Application_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setIsApplied(true);
        const updateSingleJob = {
          ...singleJob,
          applications: [
            ...(singleJob?.applications || []),
            { applicant: user?._id, status: "pending" },
          ],
        };
        dispatch(setSingleJob(updateSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Unable to apply");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications?.some((application) => {
              const applicantId = application?.applicant?._id || application?.applicant;
              return applicantId === user?._id;
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (jobId) {
      fetchSingleJob();
    }
  }, [jobId, dispatch, user?._id]);

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto my-10 px-4">
        {/* Job Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="font-bold text-3xl text-gray-900 mb-1">{singleJob?.title}</h1>
              <p className="text-indigo-600 font-semibold text-lg mb-3 flex items-center gap-2">
                <Building className="w-5 h-5" /> {singleJob?.company?.name || "Company"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="text-indigo-700 font-bold bg-indigo-50" variant="ghost">
                  <Briefcase className="w-4 h-4 mr-1" /> {singleJob?.position} Positions
                </Badge>
                <Badge className="text-red-600 font-bold bg-red-50" variant="ghost">
                  <Clock className="w-4 h-4 mr-1" /> {singleJob?.jobType}
                </Badge>
                <Badge className="text-green-700 font-bold bg-green-50" variant="ghost">
                  <DollarSign className="w-4 h-4 mr-1" /> {singleJob?.salary} LPA
                </Badge>
              </div>
            </div>
            <Button
              onClick={isApplied ? null : applyJobHandler}
              disabled={isApplied}
              className={`rounded-lg px-8 py-2 font-semibold whitespace-nowrap ${
                isApplied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {isApplied ? "Already Applied" : "Apply Now"}
            </Button>
          </div>
        </div>

        {/* Application Status Card */}
        {applicationForUser && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-md p-6 mb-8">
            <h2 className="font-bold text-lg text-green-900 mb-3">Your Application</h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                Status:{" "}
                <span className="font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs">
                  {applicationForUser.status?.toUpperCase()}
                </span>
              </p>
              {applicationForUser.interview?.date && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-gray-700">
                    <Calendar className="w-4 h-4 inline mr-2 text-green-600" />
                    Interview Date:{" "}
                    <span className="font-semibold">
                      {applicationForUser.interview.date} {applicationForUser.interview.time || ""}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <MapPin className="w-4 h-4 inline mr-2 text-green-600" />
                    Mode/Venue:{" "}
                    {applicationForUser.interview.mode
                      ? `${applicationForUser.interview.mode} • ${applicationForUser.interview.venue || "TBA"}`
                      : applicationForUser.interview.venue}
                  </p>
                  {applicationForUser.interview?.notes && (
                    <p className="text-gray-700 mt-2">
                      <span className="font-semibold">Notes:</span> {applicationForUser.interview.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-indigo-600">
            Job Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-700">Role</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.title}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-700">Location</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-700">Experience</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.experienceLevel || 0} years</p>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-700">Salary</h3>
                  <p className="text-gray-600 mt-1">₹{singleJob?.salary} LPA</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-700">Total Applicants</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.applications?.length || 0} applicants</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-700">Posted Date</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.createdAt?.split("T")[0]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-3">About this Job</h3>
            <p className="text-gray-700 leading-relaxed">{singleJob?.description}</p>

            {/* Requirements */}
            {singleJob?.requirements && singleJob.requirements.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                <div className="flex flex-wrap gap-2">
                  {singleJob.requirements.map((req, index) => (
                    <Badge key={index} className="bg-indigo-100 text-indigo-800">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;

