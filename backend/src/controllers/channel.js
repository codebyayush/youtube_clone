import Channel from "../models/channel.js";
import User from "../models/user.js";
import Video from "../models/video.js";
import mongoose from "mongoose";
import fs from "fs";

let gfs;
const conn = mongoose.connection;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "videos",
  });
  console.log("GridFS initialized");
});

//adding a new video to the channel
export const addVideosToChannel = async (req, res) => {
  const { channelId } = req.params; // extract channelId from the URL
  const videoFile = req.file; // multer adds the file to req.file
  const userId = req.userId;

  // console.log("Uploaded file:", req.file);
  // console.log("Temporary file path:", videoFile.path);

  const user = await User.findById(userId);
  const channel = await Channel.findById({_id: channelId});

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!videoFile) {
    return res.status(400).json({ message: "No video file provided" });
  }

  try {
    // generate a unique videoId
    const videoId = new mongoose.Types.ObjectId().toString();

    console.log("videoId---",videoId);

    //upload the video file to gridfs
    const writeStream = gfs.openUploadStream(videoFile.originalname, {
      metadata: {
        videoId,
        channelId,
      },
    });

    console.log("writeStream---",writeStream);

    fs.createReadStream(videoFile.path).pipe(writeStream);

    writeStream.on("finish", async (file) => {
      // delete the temporary file after upload
      fs.unlinkSync(videoFile.path);

      // creating a new video document with required fields
      const newVideo = new Video({
        videoId,
        title: videoFile.originalname, 
        thumbnailUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
        description: "default test description", // default description
        channelId,
        uploader: user.username, // default uploader name
        views: 0,
        likes: 0,
        dislikes: 0 ,
        uploadDate: new Date(),
        comments: [],
        category: "Uncategorized", // default category
      });

      // save the video document to the database
      await newVideo.save();

      // add the video to the channel's videos array
      channel.videos.push(newVideo._id);
      await channel.save();

      res.status(200).json({ message: "Video uploaded successfully", videoId });
    });

    writeStream.on("error", (err) => {
      console.error("Error uploading video to GridFS:", err);
      res.status(500).json({ message: "Error uploading video" });
    });
  } catch (error) {
    console.error("Error in addVideosToChannel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get videos by channelID
export const getVideosByChannelId = async (req, res) => {
    const { channelId } = req.params;

    try {
        // accessing videos.files collection
        const db = mongoose.connection.db;
        const filesCollection = db.collection('videos.files');

        // Find all videos with the specified channelId in metadata
        const videos = await filesCollection.find({ 'metadata.channelId': channelId }).toArray();

        if (videos.length === 0) {
            return res.status(404).json({ message: "No videos found for this channel" });
        }

        res.status(200).json({ videos });
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

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

//deleting a video from the channel
export const deleteVideoFromChannel = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Step 1: Delete the video metadata from the Video collection
    const deleteResult = await Video.deleteOne({ videoId: videoId });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ msg: "Video not found" });
    }

    // Step 2: Delete the video file from GridFS
    const db = mongoose.connection.db;
    const filesCollection = db.collection('videos.files');
    const chunksCollection = db.collection('videos.chunks');

    // Find the video file in GridFS
    const videoFile = await filesCollection.findOne({ 'metadata.videoId': videoId });

    if (!videoFile) {
      return res.status(404).json({ msg: "Video file not found in GridFS" });
    }

    // Delete the file from GridFS
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'videos' });
    await bucket.delete(videoFile._id);

    res.status(200).json({ msg: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ msg: "Failed to delete video" });
  }
};
