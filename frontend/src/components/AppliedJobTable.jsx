import { useSelector } from "react-redux";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const AppliedJobTable =()=> {
    const {allAppliedJobs} = useSelector(store=>store.job);
    return(
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Interview</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ?
                            <tr>
                                <TableCell colSpan={5} className="text-center py-6 text-gray-500">You haven't applied to any job yet</TableCell>
                            </tr>
                        : allAppliedJobs.map((appliedJob)=>(
                            <TableRow key={appliedJob?._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell>
                                    <Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' :appliedJob.status === "pending" ? 'bg-gray-400' :'bg-green-400'}`}>
                                        {appliedJob.status?.toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {appliedJob?.interview?.date ? (
                                        <div className="text-sm space-y-1">
                                            <div>{appliedJob.interview.date} {appliedJob.interview.time || ''}</div>
                                            <div>{appliedJob.interview.mode ? `${appliedJob.interview.mode} • ${appliedJob.interview.venue || 'Venue TBA'}` : appliedJob.interview.venue || 'Interview details pending'}</div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-500">No interview scheduled</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable;