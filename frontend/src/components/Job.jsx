import { Bookmark } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({job}) => {
  const navigate = useNavigate();
  // const jobId = "12dfgfdbfgghnhnfnhg"
const daysAgoFunction = (mongodbTime) =>{
  const createdAt = new Date(mongodbTime);
  const currentTime = new Date();
  const timeDiffernce = currentTime - createdAt;
  return Math.floor(timeDiffernce/(1000*24*60*60));
}
  
  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 h-full flex flex-col'>
        <div className='flex items-center justify-between mb-2'> 
     <p className='text-sm text-gray-600' >{daysAgoFunction(job?.createdAt) === 0 ? "Today": `${daysAgoFunction(job?.createdAt)}`} days ago</p>
     <Button variant="outline" className="rounded-full" size="icon"><Bookmark/></Button>
     </div>
     <div className='flex items-center gap-2 my-3'>
        <Button className="p-4" variant="outline" size="icon">
            <Avatar>
                <AvatarImage src={job?.company?.logo}/>
            </Avatar>
        </Button>
        <div className='truncate'>
            <h1 className='font-medium text-sm'>{job?.company?.name}</h1>
            <p className='text-xs text-gray-500'>India</p>
        </div>
     </div>

     <div className='flex-1'>
        <h1 className='font-bold text-base my-2 line-clamp-2'>{job?.title}</h1>
        <p className='text-sm text-gray-600 line-clamp-2'>{job?.description}</p>
     </div>
     <div className='flex items-center gap-1 mt-3 flex-wrap'>
        <Badge className={"text-indigo-700 font-bold text-xs"} variant="ghost">{job?.position} Positions</Badge>
        <Badge className={"text-red-700 font-bold text-xs"} variant="ghost">{job?.jobType}</Badge>
        <Badge className={"text-purple-600 font-bold text-xs"} variant="ghost">{job?.salary}LPA</Badge>
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <Button size="sm" variant="outline" onClick={()=>navigate(`/description`, { state: { jobId: job?._id } })} className="flex-1">Details</Button>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">Save For Later</Button>
      </div>
    </div>
  )
}

export default Job
