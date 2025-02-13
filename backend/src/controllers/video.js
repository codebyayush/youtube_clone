import { google } from "googleapis";
import Video from "../models/video.js";
import Comment from "../models/comment.js";
import Channel from "../models/channel.js";

//getting youtube data from youtube api
const youtube = google.youtube({
  version: "v3",
  auth: "AIzaSyD4lANTCWo9wpZMFs-ZjVE--8Yxwtme0P4",
});


// Helper function to add delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const fetchDataFromYoutubeAndPushToDb = async (req, res) => {
  try {

    // initial search for videos
    const searchResponse = await youtube.search.list({
      part: "snippet",
      type: "video",
      maxResults: 100,
      // q: "",
    });

    // fetch video categories
    const categoriesResponse = await youtube.videoCategories.list({
      part: "snippet",
      regionCode: "US",
    });
    const categories = categoriesResponse.data.items;

    // process videos sequentially with rate limiting
    for (const item of searchResponse.data.items) {
      try {
        // add delay between API calls
        await sleep(1000); // 1 second delay between videos

        // fetch video details
        const videoResponse = await youtube.videos.list({
          part: "snippet,statistics",
          id: item.id.videoId,
        });
        const videoInfo = videoResponse.data.items[0];

        // handle missing video info
        if (!videoInfo) {
          console.log(`Skipping deleted/unavailable video: ${item.id.videoId}`);
          continue;
        }

        // get category name
        const category = categories.find(cat => cat.id === videoInfo.snippet.categoryId);
        const categoryName = category?.snippet?.title || "Unknown";

        // save channel
        const channelId = await fetchChannelDetailsAndSave(item.snippet.channelId);

        // create video document
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
          category: categoryName,
        });

        await video.save();

        // attempt to fetch comments with error handling
        let commentsResponse;
        try {
          commentsResponse = await youtube.commentThreads.list({
            part: "snippet",
            videoId: item.id.videoId,
            maxResults: 10,
          });
        } catch (commentError) {
          if (commentError.code === 403) {
            console.log(`Comments disabled for video: ${item.id.videoId}`);
            commentsResponse = { data: { items: [] } };
          } else {
            throw commentError;
          }
        }

        // process comments if available
        const commentPromises = commentsResponse.data.items.map(async (commentItem) => {
          const commentSnippet = commentItem.snippet.topLevelComment.snippet;
          
          const comment = new Comment({
            user: null,
            video: video._id,
            text: commentSnippet.textDisplay,
            timestamp: new Date(commentSnippet.publishedAt),
          });

          await comment.save();
          return comment._id;
        });

        const commentIds = await Promise.all(commentPromises);
        video.comments = commentIds;
        await video.save();

        // update channel with video reference
        await Channel.findByIdAndUpdate(channelId, {
          $push: { videos: video._id }
        });

        console.log(`Processed video: ${item.snippet.title}`);
      } catch (videoError) {
        console.error(`Error processing video ${item.id.videoId}:`, videoError.message);
        // continue processing other videos even if one fails
      }
    }

    res.status(200).send("Video processing completed");
  } catch (error) {
    console.error("Critical error in video processing:", error);
    res.status(500).send("Video processing failed");
  }
};

//disliking a video
export const dislikeVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    video.dislikes += 1;
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    console.error("Error disliking video:", error);
    res.status(500).json({ error: "Server error" });
  }
}

//liking a video
export const likeVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    video.likes += 1;
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    console.error("Error liking video:", error);
    res.status(500).json({ error: "Server error" });
  }
}


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

//fetching all videos from database
export const fetchVideos = async (req, res) => {
      try {
          const result = await Video.find({});
          res.status(200).json({result: result});
          return;
      } catch (error) {
          res.status(500).json({msg: "Failed to fetch videos from database"})
      }
};
 
//get video by id
export const getVideoById = async (req, res) => {
    try{
        const {videoId} = req.params;
        // console.log("---------------------", videoId);
        const video = await Video.findOne({videoId: videoId});
        res.status(200).json({result: video});
        return; 
    }
    catch(error){
        res.status(500).json({msg: "Failed to fetch video from database"})
    }
};