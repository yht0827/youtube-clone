import express from 'express';
import routes from '../routes';
import { registerView, postAddComment, postDeleteComment } from '../controllers/videoController';
import { onlyPrivate } from '../middlewares';

const apiRouter = express.Router();

apiRouter.post(routes.registerView, registerView);
apiRouter.post(routes.addComment, onlyPrivate, postAddComment);
apiRouter.post(routes.deleteComment, onlyPrivate, postDeleteComment);

export default apiRouter;
