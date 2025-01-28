import { google } from "googleapis";
import Video from "../models/video.js";
import Comment from "../models/comment.js";
import Channel from "../models/channel.js";

const youtube = google.youtube({
  version: "v3",
  auth: "AIzaSyD4lANTCWo9wpZMFs-ZjVE--8Yxwtme0P4",
});

export const fetchDataFromYoutubeAndPushToDb = async (req, res) => {
  try {
    // Fetch video data using search API
    const response = await youtube.search.list({
      part: "snippet", 
      type: "video",
      maxResults: 100,
    });

    // looping through all the videos, then saving them to db with comments & channel
    const videos = response.data.items.map(async (item) => {
      // fetching video info
      const videoData = await youtube.videos.list({
        part: "statistics",
        id: item.id.videoId,
      });

      const videoInfo = videoData.data.items[0];

      // fetching channel details and saving
      const channelId = await fetchChannelDetailsAndSave(item.snippet.channelId);

      //creating and saving the video
      const video = new Video({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        description: item.snippet.description,
        channelId: channelId,
        uploader: item.snippet.channelTitle,
        uploadDate: new Date(item.snippet.publishedAt),
        views: videoInfo.statistics.viewCount || 0,
        likes: videoInfo.statistics.likeCount || 0,
        dislikes: videoInfo.statistics.dislikeCount || 0,
      });

      await video.save();

      // fetching comments for current video
      const commentsResponse = await youtube.commentThreads.list({
        part: "snippet",
        videoId: item.id.videoId,
        maxResults: 10, //fetching 10 comments for each video
      });

      // looping and saving the comments
      const comments = commentsResponse.data.items.map(async (commentItem) => {
        
        const commentSnippet = commentItem.snippet.topLevelComment.snippet;

        const comment = new Comment({
          user: null,
          video: video._id,
          text: commentSnippet.textDisplay,
          timestamp: new Date(commentSnippet.publishedAt),
        });

        await comment.save();

        //adding the comment to the video
        video.comments.push(comment._id);
      });

      //waiting for all comments to be saved
      await Promise.all(comments);

      //again saving the video
      await video.save();

      console.log(
        `Video "${item.snippet.title}" and its comments saved to MongoDB`
      );

      //adding the video to the channel
      const channel = await Channel.findById(channelId);
      channel.videos.push(video._id);
      await channel.save();
    });

    // waiting for all user data to be saved
    await Promise.all(videos);

    res.status(200).send("Videos and comments saved successfully");
  } catch (error) {
    console.error("Error fetching YouTube video data: ", error);
    res.status(500).send("Error fetching YouTube video data");
  }
};

export const deleteAllVideosAndComments = async (req, res) => {
  try {
    await Video.deleteMany();
    await Comment.deleteMany();
    await Channel.deleteMany();

    res.status(200).send("All videos and comments are deleted successfully");
  } catch (error) {
    console.error("Failed to delete all videos", error);
  }
};

const fetchChannelDetailsAndSave = async (channelId) => {
    try {
      // Fetch channel details from YouTube API
      const channelResponse = await youtube.channels.list({
        part: "snippet,statistics",
        id: channelId,
      });
  
      if (channelResponse.data.items.length === 0) {
        throw new Error("Channel not found");
      }
  
      const channelData = channelResponse.data.items[0];
  
      // Check if channel already exists in the database
      let channel = await Channel.findOne({ channelId: channelId });
  
      if (!channel) {
        // If the channel does not exist, create a new one
        channel = new Channel({
          channelId: channelId,
          channelName: channelData.snippet.title,
          owner: channelData.snippet.title,  // Use channel name as owner
          description: channelData.snippet.description || "",  // Channel description
          channelBanner: channelData.snippet.thumbnails.high?.url || "",  // Channel banner (optional)
          subscribers: channelData.statistics.subscriberCount || 0,  // Subscriber count
          videos: [],  // We'll add videos later
        });
  
        await channel.save();
        console.log(`Channel "${channel.channelName}" saved to MongoDB.`);
      } else {
        // If the channel exists, you can update its subscriber count or other details if needed
        channel.subscribers = channelData.statistics.subscriberCount || channel.subscribers;
        await channel.save();
        console.log(`Channel "${channel.channelName}" updated in MongoDB.`);
      }
  
      return channel._id;  // Return the channel's ObjectId to reference it in the video
    } catch (error) {
      console.error("Error fetching or saving channel details:", error);
      throw error;
    }
  };
