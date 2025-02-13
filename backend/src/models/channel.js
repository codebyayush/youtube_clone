import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  channelId: {  
    type: String,
    required: true,
    unique: true,  
  },
  channelName: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  description: {  
    type: String,
  },
  channelBanner: {
    type: String,
  },
  subscribers: {  
    type: Number,
    default: 0,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  videos: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
});

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
