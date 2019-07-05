import express from "express";
import routes from "../routes";
import {
    getUpload,
    postUpload,
    videoDetail,
    postEditVideo,
    deleteVideo,
    getEditVideo
  } from "../controllers/videoController";
import { uploadVideo } from "../middlewares";

const videoRouter = express.Router();

//Upload
videoRouter.get(routes.upload, getUpload);
videoRouter.post(routes.upload, uploadVideo, postUpload);

//VideoDetail
videoRouter.get(routes.videoDetail(), videoDetail);

//EditVideo
videoRouter.get(routes.editVideo(), getEditVideo);
videoRouter.post(routes.editVideo(),postEditVideo);

//DeleteVideo
videoRouter.get(routes.deleteVideo(), deleteVideo);

export default videoRouter;