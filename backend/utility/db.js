const mongoose=require("mongoose");
const uri = "mongodb+srv://siddeswar0605:siddeswar@cluster0.0lw2o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const uri="mongodb://localhost:27017"
const connectDb=async()=>{
    try {
        await mongoose.connect(uri)
        console.log(" data base connected")
        
    } catch (error) {
        console.log("database failure")
        
    }
}
module.exports=connectDb;