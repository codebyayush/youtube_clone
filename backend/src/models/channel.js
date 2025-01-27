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
    required: true,
  },
  channelBanner: {
    type: String,
    required: true,
  },
  subscribers: {
    type: Number,
    required: true,
  },
  videos: [
    {
      type: String,
    },
  ],
});

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
