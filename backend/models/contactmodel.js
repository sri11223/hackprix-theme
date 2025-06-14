const mongoose=require("mongoose")
const { string } = require("zod")

const contactschema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }

})
contactschema.pre('save',async function(){
    console.log("data saved",this)
});
const Contact=mongoose.model("Contact",contactschema);
module.exports=Contact;