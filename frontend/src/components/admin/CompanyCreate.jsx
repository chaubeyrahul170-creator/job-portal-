import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Company_API_END_POINT } from "../../../utils/constant.js";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "../../../redux/companySlice.js";
import { Loader2 } from "lucide-react";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const registeredNewCompany = async () => {
    if (!name.trim()) {
      toast.error("Please enter a company name");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${Company_API_END_POINT}/register`,
        { name: name.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res?.data?.message || "Company registered successfully!");
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to register company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="max-w-3xl mx-auto my-12 px-4">
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 md:p-10">
          <div className="mb-8">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">
              Step 1 of 2
            </span>
            <h1 className="font-bold text-3xl text-gray-900 mt-3">Register Your Company</h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Enter your company name to establish your hiring profile. You can add the logo, description, and website in the next step.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Company Name</Label>
              <Input
                type="text"
                className="mt-1.5 h-12 text-base"
                placeholder="e.g. Acme Technologies, Infosys, Startup Labs"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") registeredNewCompany();
                }}
              />
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/companies")}
                className="h-11 px-6 text-gray-600"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={registeredNewCompany}
                disabled={loading}
                className="h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                  </>
                ) : (
                  "Continue to Setup"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;

