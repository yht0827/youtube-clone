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
import {
  uploadVideo, onlyPrivate
} from "../middlewares";

const videoRouter = express.Router();

// Upload
videoRouter.get(routes.upload, onlyPrivate, getUpload);
videoRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload);

// VideoDetail
videoRouter.get(routes.videoDetail(), videoDetail);

// EditVideo
videoRouter.get(routes.editVideo(), onlyPrivate,  getEditVideo);
videoRouter.post(routes.editVideo(), onlyPrivate, postEditVideo);

// DeleteVideo
videoRouter.get(routes.deleteVideo(),onlyPrivate,  deleteVideo);

export default videoRouter;