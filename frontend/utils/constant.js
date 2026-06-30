const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const USER_API_END_POINT = `${BASE}/user`;
export const JOB_API_END_POINT = `${BASE}/job`;
export const Application_API_END_POINT = `${BASE}/application`;
export const Company_API_END_POINT = `${BASE}/company`;
