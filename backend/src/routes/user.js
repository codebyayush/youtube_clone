import { Router } from "express";
import { fetchDataFromYoutubeAndPushToDb, deleteAllVideosAndComments } from "../controllers/video.js";

const router = Router();

router.route("/fetchAndPushVideos").get(fetchDataFromYoutubeAndPushToDb)

router.route("/fetchAndPushVideos").delete( deleteAllVideosAndComments );

export default router;