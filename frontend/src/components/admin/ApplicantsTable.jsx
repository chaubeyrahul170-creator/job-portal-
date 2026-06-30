import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { Application_API_END_POINT } from "../../../utils/constant.js";

const shortListingStatus = ["Accepted", "Rejected"];
function ApplicantsTable({ applications = [], refreshApplicants }) {
    const [resumeUrl, setResumeUrl] = useState(null);
    const [openResume, setOpenResume] = useState(false);

    const [openInterview, setOpenInterview] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [interviewData, setInterviewData] = useState({ date: "", time: "", mode: "", venue: "", notes: "" });

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(
                `${Application_API_END_POINT}/status/${id}/update`,
                { status }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                if (typeof refreshApplicants === "function") refreshApplicants();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Unable to update status");
        }
    };

    const openResumeViewer = (url) => {
        if (!url) return toast.error("No resume available");
        setResumeUrl(url);
        setOpenResume(true);
    };

    const openSchedule = (id) => {
        setSelectedAppId(id);
        setInterviewData({ date: "", time: "", mode: "", venue: "", notes: "" });
        setOpenInterview(true);
    };

    const submitInterview = async (e) => {
        e.preventDefault();
        if (!selectedAppId) return;
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${Application_API_END_POINT}/status/${selectedAppId}/update`, {
                status: "accepted",
                interview: interviewData,
            });
            if (res.data.success) {
                toast.success("Interview scheduled");
                setOpenInterview(false);
                if (typeof refreshApplicants === "function") refreshApplicants();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Unable to schedule interview");
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Interview</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.length <= 0 ? (
                        <tr>
                            <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                                No applicants available yet
                            </TableCell>
                        </tr>
                    ) : (
                        applications.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullName}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded-full text-white text-xs ${
                                            item?.status === "rejected" ? "bg-red-500" : item?.status === "accepted" ? "bg-green-500" : "bg-gray-500"
                                        }`}
                                    >
                                        {item?.status?.toUpperCase()}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {item?.interview?.date ? (
                                        <div className="space-y-1 text-sm">
                                            <div>
                                                {item.interview.date} {item.interview.time || ""}
                                            </div>
                                            <div>
                                                {item.interview.mode ? `${item.interview.mode} • ${item.interview.venue || "Venue TBA"}` : item.interview.venue || "Interview details pending"}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-500">No interview scheduled</span>
                                    )}
                                </TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-44">
                                            <div onClick={() => statusHandler("accepted", item._id)} className="flex w-fit items-center my-2 cursor-pointer">
                                                <span>Accept</span>
                                            </div>
                                            <div onClick={() => statusHandler("rejected", item._id)} className="flex w-fit items-center my-2 cursor-pointer">
                                                <span>Reject</span>
                                            </div>
                                            <div onClick={() => openSchedule(item._id)} className="flex w-fit items-center my-2 cursor-pointer">
                                                <span>Schedule Interview</span>
                                            </div>
                                            <div onClick={() => openResumeViewer(item?.applicant?.profile?.resume)} className="flex w-fit items-center my-2 cursor-pointer">
                                                <span>View Resume</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </tr>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Resume viewer dialog */}
            <Dialog open={openResume} onOpenChange={setOpenResume}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Resume Preview</DialogTitle>
                    </DialogHeader>
                    <div className="h-96">
                        {resumeUrl ? (
                            <iframe src={resumeUrl} title="Resume" className="w-full h-full" />
                        ) : (
                            <div className="p-4">No resume available</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Interview scheduling dialog */}
            <Dialog open={openInterview} onOpenChange={setOpenInterview}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Schedule Interview</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitInterview} className="grid gap-3">
                        <div className="grid grid-cols-2 gap-2">
                            <input required type="date" value={interviewData.date} onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })} className="border p-2" />
                            <input required type="text" value={interviewData.time} placeholder="Time (e.g. 10:00 AM)" onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })} className="border p-2" />
                        </div>
                        <input type="text" value={interviewData.mode} placeholder="Mode (Online / Office)" onChange={(e) => setInterviewData({ ...interviewData, mode: e.target.value })} className="border p-2" />
                        <input type="text" value={interviewData.venue} placeholder="Venue or link" onChange={(e) => setInterviewData({ ...interviewData, venue: e.target.value })} className="border p-2" />
                        <textarea value={interviewData.notes} placeholder="Notes (optional)" onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })} className="border p-2" />
                        <DialogFooter>
                            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Schedule</button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
export default ApplicantsTable;