import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { setSearchedQuery } from "../../redux/jobSlice.js";
import { Briefcase } from "lucide-react";

const Browse = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto my-8 px-4">
        <div className="mb-6">
          <h1 className="font-bold text-2xl text-gray-900">
            {searchedQuery ? `Search Results for "${searchedQuery}"` : "All Job Openings"} (
            {allJobs?.length || 0})
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore the latest career opportunities matching your profile.
          </p>
        </div>

        {!allJobs || allJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <Briefcase className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">No Jobs Found</h3>
            <p className="text-sm text-gray-500 mt-1">
              There are currently no job openings matching your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allJobs.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
