import Channel from "../models/channel.js";
import User from "../models/user.js";

//just fetching the channel details
export const fetchChannel = async (req, res) => {
  try {
    const channelId = req.params.channelId;

    const channel = await Channel.findOne({ _id: channelId });

    if (!channel) {
      throw new Error("Channel not found");
    }

    return res.status(200).json({ result: channel });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to fetch channel details" });
  }
};

//get the channel by userId
export const getChannelByUserId = async (req, res) => {
  try {
    // get the user id from the request
    const userId = req.userId;

    // get the user from the database
    const user = await User.findById({ _id: userId });

    // get the channel from the database using the username
    const channel = await Channel.findOne({ owner: user.username });

    // if channel not found, return 404
    if (!channel) {
      throw new Error("Channel not found");
    }

    // if channel found, return the channel details
    return res.status(200).json({ result: channel });
  } catch (error) {
    // if error, return 500
    return res.status(500).json({ msg: "Failed to fetch channel" });
  }
};

//create a new channel
export const createChannel = async (req, res) => {
  try {

    

    const {
      channelId,
      channelName,
      description,
      channelBanner,
      subscribers,
    } = req.body;

    const user = await User.findById(req.userId);
    const owner = user.username;

    const newChannel = new Channel({
      channelId,
      channelName,
      owner,
      description,
      channelBanner,
      subscribers,
    });

    await newChannel.save();

    return res.status(200).json({ msg: "Channel created successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to create channel" });
  }
};

//adding a new video to the channel
export const addVideosToChannel = async (req, res) => {
  try {
    //get the channel and videoId from the body
    const { channelId, videoId } = req.body;

    //get the channel
    const channel = await Channel.findOne({
      _id: channelId,
    });

    if (!channel) {
      throw new Error("Channel not found");
    }

    //push videoId to the videos array in the channel
    channel.videos.push(videoId);
    //then save it
    await channel.save();
  } catch (error) {}
};
