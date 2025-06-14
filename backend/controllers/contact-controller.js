const { any } = require('zod')
const Contact=require('../models/contactmodel')
 
const contactform=async(req,res)=>{
    try {
        const response=req.body;
        await Contact.create(response);
        return res.status(200).json({msg:"message accepted"});
    } catch (error) {
        return res.status(500).json({msg:error.message});
        
    }
}
module.exports=contactform;  //exporting the function to be used in other files  //