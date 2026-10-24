// import React from 'react'
// import { Badge } from './ui/badge'
// import { useNavigate } from 'react-router-dom'



// const LatestJobCards = ({job}) => {
// const navigate = useNavigate();
//   return (
//     <div onClick={()=>navigate(`/description`, { state: { jobId: job._id } })} className='p-5 rounded-md shadow-xl bg-white border-gray-100 cursor-pointer'>
//       <div>
//         <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
//         <p className='text-sm text-gray-500'>India</p>
//       </div>
//       <div>
//         <h1 className="font-bold text-lg my-2">{job?.title}</h1>
//         <p className='text-sm text-gray-600'>{job?.description}</p>
//       </div>
//       <div className='flex items-center gap-2 mt-4'>
//         <Badge className={"text-indigo-700 font-bold"} variant="ghost">{job?.position} Positions</Badge>
//         <Badge className={"text-red-700 font-bold"} variant="ghost">{job?.jobType}</Badge>
//         <Badge className={"text-purple-600 font-bold"} variant="ghost">{job?.salary}LPA</Badge>
//       </div>
//     </div>
//   )
// }

// export default LatestJobCards



import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`, { state: { jobId: job?._id } })}
      className="p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer hover:shadow-2xl transition-all duration-200"
    >
      <div>
        <h1 className="font-semibold text-base text-gray-900">{job?.company?.name || "Company"}</h1>
        <p className="text-xs text-gray-500">{job?.location || "India"}</p>
      </div>
      <div>
        <h1 className="font-bold text-lg my-2 text-gray-900 line-clamp-1">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
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
  );
};

export default LatestJobCards;

