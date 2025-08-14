import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required:true
        },
        description: {
            type: String,
            required:true
        },
        to:{
            type:String,
            enum:["user", "employee", "both"],
            default:"user"
        },
        opened: {
            type: [mongoose.ObjectId],
        },
        createdBy:{
            type:mongoose.ObjectId
        }
    },
    { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
