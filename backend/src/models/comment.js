import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",  // referencing to User schema, assuming user data exists
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,  // referencing the Video schema
    ref: "Video",
    required: true,
  }, 
  text: { 
    type: String, 
    required: true,
  },
  timestamp: { 
    type: Date, 
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
