

const mongoose=require("mongoose");

const proposalSchema = new mongoose.Schema({
   
  
    vendorName:{
        type:String,
    },
    vendorId:{
        type:String
    },
    vendorEmail:{
        type:String,
        
    },
    eventName:{
        type:String,
    },
    placeOfEvent:{
        type:String
    },
    proposalType:{
        type:String,
        
    },
    eventType:{
        type:String
    },
    budget:{
        type:Number
    },
    fromDate:{
        type:Date,
    },
    toDate:{
        type:Date,
        
    },
    foodPreference:{
        type:String
    },
    description:{
        type:String
    },
    events: {
        type: String
    },
    image: {
        type: Array
        
    }




})

const proposalModel = mongoose.model("proposal-data", proposalSchema )

module.exports = proposalModel;

