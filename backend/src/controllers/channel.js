import Channel from "../models/channel.js";
import User from "../models/user.js";


//get the channel by channelId
export const fetchChannel = async (req, res) => {
  try {
    // get the channel id from the request
    const channelId = req.params.channelId;

    // get the channel from the database
    const channel = await Channel.findOne({ _id: channelId });

    // if channel not found, return 404
    if (!channel) {
      throw new Error("Channel not found");
    }

    // return the channel details
    return res.status(200).json({ result: channel });
  } catch (error) {
    // if error, return 500
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
    const channel = await Channel.findOne({ user: user._id });

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
    // extract the channel details from the request body
    const { channelId, channelName, description, channelBanner, subscribers } =
      req.body;

    // get the user from the database
    const user = await User.findById(req.userId);

    // extract the owner from the user
    const owner = user.username;

    // create a new channel
    const newChannel = new Channel({
      channelId,
      channelName,
      owner,
      user: user._id,
      description,
      channelBanner,
      subscribers,
    });

    // save the new channel
    await newChannel.save();

    // also add it to the user object
    user.channel = newChannel._id;

    // save the user
    await user.save();

    // return the result
    return res.status(200).json({ msg: "Channel created successfully" });
  } catch (error) {
    // if error, return 500
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
