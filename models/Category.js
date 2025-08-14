import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
    lowercase:true
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  images:{
    type:[String],
  }
});

export default mongoose.model("Category", categorySchema);
