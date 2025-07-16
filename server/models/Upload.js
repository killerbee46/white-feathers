import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  image:{
    type:String
  }
});

export default mongoose.model("uploads", fileSchema);