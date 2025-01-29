import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  channelId: {
    type: String, // this is fetched from youtube, so it should be a string not a reference
    required: true,
  },
  uploader: {
    type: String, // this is also fetched from youtube
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  uploadDate: {
    type: Date,
    required: true,
  },
  comments: [
    {
      type: String,
      required: true,
    },
  ],
  category: {
    type: String,
    required: true,
  }
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
