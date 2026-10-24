import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
       ref:'Job',
       required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending'
    },
    interview:{
      date:{type:String, default:null},
      time:{type:String, default:null},
      venue:{type:String, default:null},
      mode:{type:String, default:null},
      notes:{type:String, default:null}
    }
},{timestamps:true})

export const Application = mongoose.model("Application",applicationSchema);
