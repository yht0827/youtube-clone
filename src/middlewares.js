import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import moment from 'moment';
import routes from './routes';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: 'ap-northeast-2'
});

const multerVideo = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: 'heetube/video'
  })
});

const multerAvatar = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: 'heetube/avatar'
  })
});

export const uploadVideo = multerVideo.single('videoFile');
export const uploadAvatar = multerAvatar.single('avatar');

export const localsMiddleware = (req, res, next) => {
  res.locals.moment = moment;
  res.locals.siteName = 'YouTube';
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    // 로그인이 되어있는경우
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};

export const localUserCheck = (req, res, next) => {
  if (
    req.user &&
    !req.user.kakaoId &&
    !req.user.googleId &&
    !req.user.githubId &&
    !req.user.facebookId
  ) {
    next();
  } else {
    res.redirect(routes.home);
  }
};
