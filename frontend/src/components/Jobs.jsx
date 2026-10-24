import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Briefcase } from "lucide-react";

const Jobs = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs || []);

  useEffect(() => {
    if (!allJobs) return;

    if (searchedQuery) {
      const query = searchedQuery.toLowerCase();

      const filtered = allJobs.filter((job) => {
        // Salary Range Filtering
        if (query === "0-5 lpa") {
          return Number(job?.salary) <= 5;
        }
        if (query === "5-10 lpa") {
          return Number(job?.salary) >= 5 && Number(job?.salary) <= 10;
        }
        if (query === "10-20 lpa") {
          return Number(job?.salary) >= 10 && Number(job?.salary) <= 20;
        }
        if (query === "20+ lpa") {
          return Number(job?.salary) >= 20;
        }

        // Textual Matching (Title, Description, Company Name, Location)
        const titleMatch = job?.title?.toLowerCase().includes(query);
        const descMatch = job?.description?.toLowerCase().includes(query);
        const locationMatch = job?.location?.toLowerCase().includes(query);
        const companyMatch = job?.company?.name?.toLowerCase().includes(query);

        return titleMatch || descMatch || locationMatch || companyMatch;
      });

      setFilterJobs(filtered);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-6 px-4">
        <div className="flex gap-6">
          {/* Left Sidebar Filter */}
          <div className="w-1/4 min-w-[260px] hidden md:block">
            <FilterCard />
          </div>

          {/* Jobs Listing */}
          <div className="flex-1 pb-10">
            {filterJobs.length <= 0 ? (
              <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <Briefcase className="w-12 h-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800">No Jobs Found</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search query or clear the filters to view more opportunities.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 font-medium mb-4">
                  Showing <span className="font-semibold text-gray-800">{filterJobs.length}</span> job openings
                </p>
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
    </div>
  );
};

export default Jobs;
