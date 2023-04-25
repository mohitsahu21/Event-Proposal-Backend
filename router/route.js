const mongoose=require("mongoose")
const express=require('express');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const registerModel=require("../Schema/registerschema.js"); 
const registerUserModel = require('../Schema/userSchema/registeruser.js');
const {requireLogin} = require('../middleware/auth.js');

const proposalModel = require("../Schema/proposalSchema.js")
const router=express.Router();
const cors=require("cors")
router.use(cors())
router.use(express.json());
router.use(express.urlencoded({extended:true}))
require("dotenv").config();
const multer=require("multer")
const {GridFsStorage}=require("multer-gridfs-storage")
const {GridFSBucket,MongoClient}=require("mongodb")

const ImageDetailsSchema = new mongoose.Schema(
    {
        image : String
    },
    {
        collection : "ImageDetails" ,
    }
);
mongoose.model("ImageDetails",ImageDetailsSchema);

const Images = mongoose.model("ImageDetails");

router.post("/uploadimage", async (req,res) => {
    const {base64} = req.body;
    try{
        Images.create({image:base64})
        res.send({ status : "ok"});

    } catch (error){
        res.send({ status : "error"}); 
    }
})


router.post("/createproposal",async (req,res) => {
    let {eventName, placeOfEvent,proposalType,eventType, budget,fromDate, toDate,foodPreference,description ,events,token} = req.body;
   
 try {
     
      
    const vendor = jwt.verify(token,"secret_key")
    const vendorEmail = vendor.email;
    const vendorId = vendor._id;
    const vendorName = vendor.name;
    console.log(vendorEmail)
    
        let proposalData =  await new proposalModel({
            eventName, placeOfEvent,proposalType,eventType, budget,fromDate, toDate,foodPreference,description ,events,vendorEmail:vendorEmail,vendorId:vendorId,vendorName:vendorName
        });
        const data = await proposalData.save();
        res.send({ status : "ok"});
       
} catch(error)
{
    res.send({ status : "error"});
}
 });

 
router.delete("/deleteproposal",async (req,res) => {
    let {id} = req.body; 
    try {
        
            
           await proposalModel.findByIdAndDelete(id);
       const payload =  await proposalModel.find();
           
        //    res.send({ status : "ok" });
           res.send(payload)

          
   } catch(error)
   {
       res.send({ status : "error"});
   } 
    });


 router.get("/proposals",async (req,res) => {
   
   try{ 
    const proposals = await proposalModel.find();
    res.send(proposals);
   }catch (err){
     console.log(err)
}
 });

 router.post("/vendordata" , async (req,res) => {
    const {token} = req.body;
    try{
        const vendor = jwt.verify(token,"secret_key")
        const vendoremail = vendor.email;
        registerModel.findOne({email: vendoremail}).then((data) => {

            res.send({status :"ok", data :data });
        }).catch((error)=> {
            res.send({status :"error", data :error })
        });
    }catch(error){
        res.send({ status : "error"});
    }
 })

 
router.post("/register",async (req,res)=>{

    let {name,email,contact,password}=req.body;
    try
  
    {
        // console.log(req.body);
        const oldVender =await registerModel.findOne({email})
        if (oldVender){
           return res.send({  status : "error", error : "Vendor Exist"})
        }
        
            let securepass=await bcrypt.hash(password,10)
            console.log(securepass);
           await registerModel.create({
               name:name,
               email:email,
               contact:contact,
               password:securepass,
               
            });
           
            res.send({ status : "ok"});
    }
    catch (error)
    {
        res.send({ status : "error"});
    }
})


router.post("/login",async (req,res)=>{

    const {email,password}=req.body;

    try {
    const vendor =await registerModel.findOne({email});
    if (!vendor){
        return res.json({ status  : "error",  error : "Vendor not found"})
    }
    if ( await bcrypt.compare(password,vendor.password) )
    {
        const token= await jwt.sign({_id : vendor._id, email:vendor.email, name : vendor.name},"secret_key")
        if (res.status(201)){
            return res.json({status :"ok" , data : token});
        }else {
            return res.json({ error : "error"});
        }
  
    }
    res.json({status  : "error" , error : "Invalid Password"})

    } catch (err){
      res.send(err)
    }
});

router.post("/user/register",async (req,res)=>{
    let {name,email,contact,password}=req.body;
    try
  
    {
        // console.log(req.body);
        const oldUser =await registerUserModel.findOne({email})
        if (oldUser){
           return res.send({  status : "error", error : "User Exist"})
        }
        
            let securepass=await bcrypt.hash(password,10)
            console.log(securepass);
           await registerUserModel.create({
               name:name,
               email:email,
               contact:contact,
               password:securepass,
               
            });
           
            res.send({ status : "ok"});
    }
    catch (error)
    {
        res.send({ status : "error"});
    }
})





router.post("/user/login",async (req,res)=>{
    const {email,password}=req.body;

    try {
    const user =await registerUserModel.findOne({email});
    if (!user){
        return res.json({ status  : "error",  error : "User not found"})
    }
    if ( await bcrypt.compare(password,user.password) )
    {
        const token= await jwt.sign({_id : user._id, email:user.email,},"secret_key")
        if (res.status(201)){
            return res.json({status :"ok" , data : token});
        }else {
            return res.json({ error : "error"});
        }
  
    }
    res.json({status  : "error" , error : "Invalid Password"})

    } catch (err){
      res.send(err)
    }
})


module.exports=router
