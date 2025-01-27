import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  commentId: { 
    type: String, 
    required: true, 
    unique: true },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true }, // referencing to user schema
  videoId: {
    type: mongoose.Schema.Types.ObjectId,  // referencing to video schema
    ref: "Video",
    required: true,
  }, 
  text: { 
    type: String, 
    required: true },
  timestamp: { 
    type: Date, 
    required: true },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
