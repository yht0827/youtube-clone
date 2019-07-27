import express from 'express';
import passport from 'passport';
import routes from '../routes';
import Video from '../models/Video';
import * as userController from '../controllers/userController';
import * as videoController from '../controllers/videoController';
import { onlyPublic, onlyPrivate, uploadVideo, uploadAvatar, localUserCheck } from '../middlewares';

const router = express.Router();

// home

router.get(routes.home, async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({
        _id: -1
      })
      .populate('creator');
    res.render('home', {
      pageTitle: 'Home',
      videos
    });
  } catch (error) {
    res.render('home', {
      pageTitle: 'Home',
      videos: []
    });
  }
});

// join

router.get(routes.join, onlyPublic, userController.getJoin);
router.post(routes.join, onlyPublic, userController.postJoin, userController.postLogin);

// login
router.get(routes.login, onlyPublic, userController.getLogin);
router.post(routes.login, onlyPublic, userController.postLogin);

// login - github

router.get(routes.gitHub, userController.githubLogin);
router.get(
  routes.githubCallback, // 사용자가 돌아올 주소 지정
  passport.authenticate('github', {
    failureRedirect: '/login', // 돌아온 사용자를 passport 인증을 활용해 로그인 , 실패시 /login 페이지로 리다이렉트
    successFlash: 'Welcome', // FlashMessage 로그인 성공시 welcome
    failureFlash: "Can't Log In"
  }),
  userController.postGithubLogIn // 로그인 완료되면 홈으로 리다이렉트
);

// login - facebook

router.get(routes.facebook, userController.facebookLogin);
router.get(
  routes.facebookCallback,
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    successFlash: 'Welcome',
    failureFlash: "Can't Log In"
  }),
  userController.postFacebookLogin
);

// login - kakao

router.get(routes.kakao, userController.kakaoLogin);
router.get(
  routes.kakaoCallback,
  passport.authenticate('kakao', {
    failureRedirect: '/login',
    successFlash: 'Welcome',
    failureFlash: "Can't Log In"
  }),
  userController.postKakaoLogin
);

// login - google

router.get(routes.google, userController.googleLogin);

router.get(
  routes.googleCallback,
  passport.authenticate('google', {
    failureRedirect: '/login',
    successFlash: 'Welcome',
    failureFlash: "Can't Log In"
  }),
  userController.postGoogleLogin
);

// log out

router.get(routes.logout, onlyPrivate, userController.logout);

// search

router.get(routes.search, async (req, res) => {
  const {
    query: { term: searchingBy }
  } = req;
  // const searchingBy = req.query.term;
  let videos = [];
  try {
    videos = await Video.find({
      title: {
        $regex: searchingBy,
        $options: 'i'
      }
    }).populate('creator');
  } catch (error) {
    console.log(error);
  }
  if (videos.length === 0) {
    req.flash('error', "Can't Find Videos");
  }
  res.render('search', {
    pageTitle: 'Search',
    searchingBy,
    videos
  });
});

// upload

router.get(routes.upload, onlyPrivate, videoController.getUpload);
router.post(routes.upload, onlyPrivate, uploadVideo, videoController.postUpload);

// profile

router.get(routes.me, userController.getMe);
router.get(routes.userDetail, userController.userDetail);
router.get(routes.editProfile, onlyPrivate, userController.getEditProfile);
router.post(routes.editProfile, onlyPrivate, uploadAvatar, userController.postEditProfile);

// password

router.get(routes.changePassword, onlyPrivate, localUserCheck, userController.getChangePassword);
router.post(routes.changePassword, onlyPrivate, userController.postChangePassword);

// videoDetail

router.get(`${routes.videoDetail}/:id`, videoController.videoDetail);

// editVideo

router.get(`${routes.editVideo}/:id`, onlyPrivate, videoController.getEditVideo);
router.post(`${routes.editVideo}/:id`, onlyPrivate, videoController.postEditVideo);

// delete Video

router.get(`${routes.deleteVideo}/:id`, onlyPrivate, videoController.deleteVideo);

export default router;
