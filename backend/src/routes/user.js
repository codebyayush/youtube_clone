import { Router } from "express";
import { fetchDataFromYoutubeAndPushToDb, deleteAllVideosAndComments, fetchVideos, likeVideo, dislikeVideo } from "../controllers/video.js";
import { handleLogin, handleLogout, handleCreateNewUser, isLoginCheck, getUserByUserId } from "../controllers/user.js";
import requireAuth from "../middlewares/requireAuth.js";
import { getVideoById } from "../controllers/video.js";
import { fetchComments, addComment, deleteComment, editComment } from "../controllers/comment.js";
import { createChannel, fetchChannel } from "../controllers/channel.js";
import { getChannelByUserId } from "../controllers/channel.js";

const router = Router();


//ROUTES to add and remove all videos from youtube api in the channel, comment and video schemas 
router.route("/fetchAndPushVideos").get(fetchDataFromYoutubeAndPushToDb)
router.route("/fetchAndPushVideos").delete( deleteAllVideosAndComments );

//ROUTE to fetchVideos from the database
router.route("/fetchAllVideos").get(fetchVideos);


//Authentication ROUTES
// creating a new user
router.route("/signup").post(handleCreateNewUser);
// logging in to existing user
router.route("/login").post(handleLogin);
// get user by Id
router.route("/getUser").get(requireAuth, getUserByUserId);
//logout and clear jwt
router.route("/logout").get(handleLogout);
// checking if user is logged in or not using middleware
router.route("/islogin").get(requireAuth, isLoginCheck);
//get video by id
router.route("/getVideo/:videoId").get(getVideoById);

//Comments ROUTES
//fetching all comments by videoId
router.route("/getComments/:videoId").get(fetchComments);
// add a comment check with middleware
router.route("/addComment").post(requireAuth, addComment);
// edit a comment check with middleware
router.route("/editComment/:commentId").put(requireAuth, editComment);
// delete a comment check with middleware
router.route("/deleteComment/:commentId").delete(requireAuth, deleteComment);


//like and dislike routes
router.route("/likeVideo/:videoId").put(requireAuth, likeVideo);
//dislike route
router.route("/dislikeVideo/:videoId").put(requireAuth, dislikeVideo);


//Channel ROUTES
//get channel by channelId
router.route("/fetchChannel/:channelId").get(fetchChannel);
//get channel by userId
router.route("/getChannel").get(requireAuth, getChannelByUserId);
//create a new channel
router.route("/createChannel").post(requireAuth, createChannel);


export default router;