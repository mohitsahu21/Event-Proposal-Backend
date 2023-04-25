const mongoose=require("mongoose")
const url = "mongodb+srv://mohitsahu1993:mohitsahu@cluster0.uqnigqq.mongodb.net/test"
mongoose.connect("mongodb+srv://pkanakdande:10xacademy@cluster1.rnu1bgi.mongodb.net/")
.then(res=>{
    console.log("connected")
})
.catch(res=>{
    console.log("error")
})
