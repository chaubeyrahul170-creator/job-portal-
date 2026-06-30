import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {getAllJobs, getJobById, postJob,getAdminJobs} from "../controllers/job.controller.js";

const router = express.Router();
// only posting and admin routes require auth
router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs); // public
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById); // public
export default router;