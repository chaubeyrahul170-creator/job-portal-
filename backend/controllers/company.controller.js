import {Company} from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import saveLocalFile from "../utils/localFileStorage.js";

const useCloudinary = Boolean(process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET);
export const registerCompany = async(req,res)=>{
    try{
       const {name} = req.body;
       if(!name){
        return res.status(400).json({
            message:"Company name is required",
            success:false
        });
       }
       let company = await Company.findOne({name:name});
       if(company){
        return res.status(400).json({
            message:"you can't register same company",
            success:false
        })
       };
     company= await Company.create({
        name:name,
        userId:req.id
     })

     return res.status(201).json({
        message:"company registered successfully",
        company,
        success:true
     })

    }catch(error){
        console.log(error);
    }
}

export const getCompany = async(req,res)=>{
    try{
         const companies = await Company.find();
         if(!companies || companies.length === 0){
            return res.status(404).json({
                message:"companies not found",
                success:false
            })
         }
         return res.status(200).json({
            companies,
            success:true
         })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Unable to fetch companies",
            success:false
        });
    };
}

export const getCompanyById = async(req,res)=>{
    try{
      const companyId = req.params.id;
      const company = await Company.findById(companyId);
      if(!company){
        return res.status(404).json({
            message:"company not found",
            success:false
        })
      }
      return res.status(200).json({
        company,
        success:true
      })
    }catch(error){
        console.log(error);
    }
}

export const updateCompany = async(req,res)=>{
    try{
        const {name,description,website,location} = req.body;
        const file = req.file;

        const updateData = {name,description,website,location};

        if(file && file.originalname && file.buffer){
            const fileUri = getDataUri(file);
            if(useCloudinary){
              const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
              updateData.logo = cloudResponse.secure_url;
            } else {
              updateData.logo = saveLocalFile(file, "company-logos");
            }
        }

        const company = await Company.findByIdAndUpdate(req.params.id,updateData,{new:true});

        if(!company){
            return res.status(404).json({
                message:"Company not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"company information updated",
            success:true,
            company
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Unable to update company",
            success:false
        });
    }
}