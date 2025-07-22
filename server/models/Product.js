import mongoose from "mongoose";

// interface materialsType {
//   materialId:String;
//   metalId?:String;
//   weight:Number;
//   unit:"gm"|"tola"|"carat"|"cent";
//   makingCharge?:Number;
//   makingUnit?:"gm"|"tola"|"percent"
// }

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    materials:{
      type:[Object],
    }
    // slug: {
    //   type: String,
    //   required: true,
    // },
    // description: {
    //   type: String,
    //   required: true,
    // },
    // offers:{
    //   type:[String],
    // },
    // categoryId: {
    //   type: mongoose.ObjectId,
    //   ref: "Category",
    //   required: true,
    // },
    // giftId: {
    //   type: mongoose.ObjectId,
    //   ref: "Gift",
    //   required: true,
    // },
    // preferenceId: {
    //   type: mongoose.ObjectId,
    //   ref: "Preference",
    //   required: true,
    // },
    // image: {
    //   type: String,
    // },
    // images:{
    //   type:[String]
    // },
    // status: {
    //   type: Boolean,
    // },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
