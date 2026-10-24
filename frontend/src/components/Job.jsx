// // import { Bookmark } from 'lucide-react'
// // import React from 'react'
// // import { Button } from './ui/button'

// // import { Avatar, AvatarImage } from './ui/avatar'
// // import { Badge } from './ui/badge'
// // import { useNavigate } from 'react-router-dom'

// // const Job = ({job}) => {
// //   const navigate = useNavigate();
// //   // const jobId = "12dfgfdbfgghnhnfnhg"
// // const daysAgoFunction = (mongodbTime) =>{
// //   const createdAt = new Date(mongodbTime);
// //   const currentTime = new Date();
// //   const timeDiffernce = currentTime - createdAt;
// //   return Math.floor(timeDiffernce/(1000*24*60*60));
// // }
  
// //   return (
// //     <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 h-full flex flex-col'>
// //         <div className='flex items-center justify-between mb-2'> 
// //      <p className='text-sm text-gray-600' >{daysAgoFunction(job?.createdAt) === 0 ? "Today": `${daysAgoFunction(job?.createdAt)}`} days ago</p>
// //      <Button variant="outline" className="rounded-full" size="icon"><Bookmark/></Button>
// //      </div>
// //      <div className='flex items-center gap-2 my-3'>
// //         <Button className="p-4" variant="outline" size="icon">
// //             <Avatar>
// //                 <AvatarImage src={job?.company?.logo}/>
// //             </Avatar>
// //         </Button>
// //         <div className='truncate'>
// //             <h1 className='font-medium text-sm'>{job?.company?.name}</h1>
// //             <p className='text-xs text-gray-500'>India</p>
// //         </div>
// //      </div>

// //      <div className='flex-1'>
// //         <h1 className='font-bold text-base my-2 line-clamp-2'>{job?.title}</h1>
// //         <p className='text-sm text-gray-600 line-clamp-2'>{job?.description}</p>
// //      </div>
// //      <div className='flex items-center gap-1 mt-3 flex-wrap'>
// //         <Badge className={"text-indigo-700 font-bold text-xs"} variant="ghost">{job?.position} Positions</Badge>
// //         <Badge className={"text-red-700 font-bold text-xs"} variant="ghost">{job?.jobType}</Badge>
// //         <Badge className={"text-purple-600 font-bold text-xs"} variant="ghost">{job?.salary}LPA</Badge>
// //       </div>
// //       <div className='flex items-center gap-2 mt-4'>
// //         <Button size="sm" variant="outline" onClick={()=>navigate(`/description`, { state: { jobId: job?._id } })} className="flex-1">Details</Button>
// //         <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">Save For Later</Button>
// //       </div>
// //     </div>
// //   )
// // }

// // export default Job




// import { Bookmark } from "lucide-react";
// import React from "react";
// import { Button } from "./ui/button";
// import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
// import { Badge } from "./ui/badge";
// import { useNavigate } from "react-router-dom";

// const Job = ({ job }) => {
//   const navigate = useNavigate();

//   const daysAgoFunction = (mongodbTime) => {
//     if (!mongodbTime) return "Recently";
//     const createdAt = new Date(mongodbTime);
//     const currentTime = new Date();
//     const timeDifference = currentTime - createdAt;
//     const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
//     if (days === 0) return "Today";
//     if (days === 1) return "1 day ago";
//     return `${days} days ago`;
//   };

//   return (
//     <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100 h-full flex flex-col justify-between hover:shadow-2xl transition-all duration-200">
//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <p className="text-sm text-gray-500 font-medium">
//             {daysAgoFunction(job?.createdAt)}
//           </p>
//           <Button variant="outline" className="rounded-full" size="icon">
//             <Bookmark className="w-4 h-4" />
//           </Button>
//         </div>

//         <div className="flex items-center gap-3 my-3">
//           <Button className="p-2 h-12 w-12" variant="outline" size="icon">
//             <Avatar className="h-10 w-10">
//               <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
//               <AvatarFallback>{job?.company?.name?.[0] || "C"}</AvatarFallback>
//             </Avatar>
//           </Button>
//           <div className="truncate">
//             <h1 className="font-semibold text-base text-gray-900 truncate">
//               {job?.company?.name || "Company"}
//             </h1>
//             <p className="text-xs text-gray-500">{job?.location || "India"}</p>
//           </div>
//         </div>

//         <div className="my-2">
//           <h1 className="font-bold text-lg text-gray-900 line-clamp-1">
//             {job?.title}
//           </h1>
//           <p className="text-sm text-gray-600 line-clamp-2 mt-1">
//             {job?.description}
//           </p>
//         </div>

//         <div className="flex items-center gap-2 mt-4 flex-wrap">
//           <Badge className="text-indigo-700 bg-indigo-50 font-bold text-xs" variant="ghost">
//             {job?.position} Positions
//           </Badge>
//           <Badge className="text-red-700 bg-red-50 font-bold text-xs" variant="ghost">
//             {job?.jobType}
//           </Badge>
//           <Badge className="text-purple-700 bg-purple-50 font-bold text-xs" variant="ghost">
//             {job?.salary} LPA
//           </Badge>
//         </div>
//       </div>

//       <div className="flex items-center gap-3 mt-6">
//         <Button
//           size="sm"
//           variant="outline"
//           onClick={() => navigate(`/description/${job?._id}`, { state: { jobId: job?._id } })}
//           className="flex-1 font-semibold"
//         >
//           Details
//         </Button>
//         <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1 font-semibold">
//           Save For Later
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Job;














import { Bookmark } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveJob } from "../../redux/jobSlice.js";
import { toast } from "sonner";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.job);
  const isSaved = savedJobs?.some((j) => j._id === job?._id);

  const saveJobHandler = () => {
    dispatch(toggleSaveJob(job));
    if (isSaved) {
      toast.info(`Removed "${job?.title}" from saved jobs`);
    } else {
      toast.success(`Saved "${job?.title}" for later!`);
    }
  };

  const daysAgoFunction = (mongodbTime) => {
    if (!mongodbTime) return "Recently";
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  return (
    <div className="p-5 rounded-xl shadow-md hover:shadow-xl bg-white border border-gray-100 h-full flex flex-col justify-between transition-all duration-200">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 font-medium">
            {daysAgoFunction(job?.createdAt)}
          </p>
          <Button
            onClick={saveJobHandler}
            variant="ghost"
            size="icon"
            className={`rounded-full hover:bg-indigo-50 transition-colors ${
              isSaved ? "text-indigo-600 hover:text-indigo-700" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-indigo-600" : ""}`} />
          </Button>
        </div>

        <div className="flex items-center gap-3 my-3">
          <div className="p-2 h-12 w-12 border border-gray-100 rounded-lg flex items-center justify-center bg-gray-50 shadow-sm overflow-hidden">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={job?.company?.logo}
                alt={job?.company?.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    job?.company?.name || "C"
                  )}&background=4f46e5&color=fff&size=128&bold=true`;
                }}
              />
              <AvatarFallback className="bg-indigo-600 text-white font-bold">
                {job?.company?.name?.[0] || "C"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="truncate">
            <h1 className="font-semibold text-base text-gray-900 truncate">
              {job?.company?.name || "Company"}
            </h1>
            <p className="text-xs text-gray-500">{job?.location || "India"}</p>
          </div>
        </div>

        <div className="my-2">
          <h1 className="font-bold text-lg text-gray-900 line-clamp-1">
            {job?.title}
          </h1>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {job?.description}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <Badge className="text-indigo-700 bg-indigo-50 font-bold text-xs" variant="ghost">
            {job?.position} Positions
          </Badge>
          <Badge className="text-red-700 bg-red-50 font-bold text-xs" variant="ghost">
            {job?.jobType}
          </Badge>
          <Badge className="text-purple-700 bg-purple-50 font-bold text-xs" variant="ghost">
            {job?.salary} LPA
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/description/${job?._id}`, { state: { jobId: job?._id } })}
          className="flex-1 font-semibold border-gray-300 hover:border-indigo-600 hover:text-indigo-600 transition-colors"
        >
          Details
        </Button>
        <Button
          size="sm"
          onClick={saveJobHandler}
          className={`flex-1 font-semibold transition-all ${
            isSaved
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {isSaved ? "Saved ✓" : "Save For Later"}
        </Button>
      </div>
    </div>
  );
};

export default Job;

