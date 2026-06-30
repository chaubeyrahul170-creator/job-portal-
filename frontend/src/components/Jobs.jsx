import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
  const {allJobs,searchedQuery} = useSelector(store=>store.job);
  const [filterJobs,setFilterJobs] = useState(allJobs);
  useEffect(()=>{
    if(searchedQuery){
  const filteredJobs = allJobs.filter((job)=>{
    return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) || job.description.toLowerCase().includes(searchedQuery.toLowerCase()) || job.location.toLowerCase().includes(searchedQuery.toLowerCase()) 
  })
  setFilterJobs(filteredJobs)
    }else{
      setFilterJobs(allJobs)
    }
  },[allJobs,searchedQuery]);
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4">
        <div className="flex gap-5 h-[88vh]">
          <div className="w-1/5 min-w-max">
            <FilterCard />
          </div>
        
        {filterJobs.length <= 0 ? (
          <span>Job Not Found</span>
        ) : (
          <div className="flex-1 overflow-y-auto pb-5 pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {filterJobs.map((job) => (
                <div key={job?._id}>
                  <Job job={job} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Jobs;
