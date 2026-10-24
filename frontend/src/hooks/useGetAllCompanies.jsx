import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Company_API_END_POINT } from "../../utils/constant.js";
import { setCompanies } from "../../redux/companySlice.js";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Recruiter sees ONLY their own companies; Students see all companies
        const endpoint =
          user && user.role === "recruiter"
            ? `${Company_API_END_POINT}/getadmincompanies`
            : `${Company_API_END_POINT}/get`;

        const res = await axios.get(endpoint, { withCredentials: true });
        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompanies();
  }, [user?.role, user?._id, dispatch]);
};

export default useGetAllCompanies;

