import { Router } from "express";
import { fetchDataFromYoutubeAndPushToDb, deleteAllVideosAndComments, fetchVideos } from "../controllers/video.js";
import { handleLogin, handleLogout, handleCreateNewUser, isLoginCheck } from "../controllers/user.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = Router();


//ROUTES to add and remove all videos from youtube in the channel, comment and video schemas 
router.route("/fetchAndPushVideos").get(fetchDataFromYoutubeAndPushToDb)
router.route("/fetchAndPushVideos").delete( deleteAllVideosAndComments );

//ROUTE to fetchVideos from the database
router.route("/fetchAllVideos").get(fetchVideos);


//Authentication ROUTES
// creating a new user
router.route("/signup").post(handleCreateNewUser);
// logging in to existing user
router.route("/login").post(handleLogin);
//logout and clear jwt
router.route("/logout").get(handleLogout);
// checking if user is logged in or not using middleware
router.route("/islogin").get(requireAuth, isLoginCheck);

//Comment Routes



export default router;