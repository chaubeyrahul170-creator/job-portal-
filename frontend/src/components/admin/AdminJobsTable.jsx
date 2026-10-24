import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Eye, MoreHorizontal, Building, ExternalLink } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs || []);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = (allAdminJobs || []).filter((job) => {
      if (!searchJobByText) return true;
      const query = searchJobByText.toLowerCase();
      const companyMatch = job?.company?.name?.toLowerCase().includes(query);
      const titleMatch = job?.title?.toLowerCase().includes(query);
      return companyMatch || titleMatch;
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mt-6">
      <Table>
        <TableCaption className="py-4 text-xs text-gray-500">
          A list of your recently posted jobs
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-800">Company Name</TableHead>
            <TableHead className="font-semibold text-gray-800">Role / Title</TableHead>
            <TableHead className="font-semibold text-gray-800">Posted Date</TableHead>
            <TableHead className="text-right font-semibold text-gray-800">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500 font-medium">
                No jobs found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job) => (
              <TableRow key={job._id} className="hover:bg-gray-50/80 transition-colors">
                <TableCell className="font-medium text-gray-900">
                  {job?.company?.name || "Company"}
                </TableCell>
                <TableCell className="font-medium text-indigo-600">
                  {job?.title}
                </TableCell>
                <TableCell className="text-gray-500">
                  {job?.createdAt ? job.createdAt.split("T")[0] : "Recently"}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-gray-600 cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="flex items-center gap-2 p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-md cursor-pointer text-sm font-medium transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Applicants</span>
                      </div>
                      <div
                        onClick={() => navigate(`/description/${job._id}`)}
                        className="flex items-center gap-2 p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-md cursor-pointer text-sm font-medium transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Preview Job</span>
                      </div>
                      {job?.company?._id && (
                        <div
                          onClick={() => navigate(`/admin/companies/${job.company._id}`)}
                          className="flex items-center gap-2 p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-md cursor-pointer text-sm font-medium transition-colors"
                        >
                          <Building className="w-4 h-4" />
                          <span>Edit Company</span>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
