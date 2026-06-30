import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios'
import { Application_API_END_POINT } from '../../../utils/constant.js'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '../../../redux/applicationSlice.js'

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const {applicants} = useSelector(store=>store.application)
  const [loading, setLoading] = useState(false);

  const fetchApplicants = async () =>{
    try{
      setLoading(true);
      const res = await axios.get(`${Application_API_END_POINT}/${params.id}/applicants`,{withCredentials:true});
      if(res.data.success){
        dispatch(setAllApplicants(res.data.job))
      }
    }catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchApplicants()
  },[params.id])

  return (
    <div>
      <Navbar/>
      <div className='max-w-6xl mx-auto'>
        <h1 className='font-bold text-xl my-5'>Applicants {applicants?.applications?.length || 0}</h1>
        <ApplicantsTable applications={applicants?.applications || []} refreshApplicants={fetchApplicants} loading={loading} />
      </div>
    </div>
  )
}

export default Applicants
