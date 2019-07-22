import express from "express";
import passport from "passport";
import routes from "../routes";
import { home, search } from "../controllers/videoController";
import {
    getJoin,
    logout,
    postJoin,
    getLogin,
    postLogin,
    githubLogin,
    postGithubLogIn,
    getMe,
    facebookLogin,
    postFacebookLogin,
    kakaoLogin,
    postKakaoLogin,
    googleLogin,
    postGoogleLogin
  } from "../controllers/userController";
import { onlyPublic, onlyPrivate } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.join,onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin,postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.gitHub,githubLogin);
globalRouter.get(
  routes.githubCallback, // 사용자가 돌아올 주소 지정
  passport.authenticate('github', { failureRedirect: "/login"}), // 돌아온 사용자를 passport 인증을 활용해 로그인 , 실패시 /login 페이지로 리다이렉트
  postGithubLogIn // 로그인 완료되면 홈으로 리다이렉트
);

globalRouter.get(routes.me,getMe);

globalRouter.get(routes.facebook,facebookLogin);
globalRouter.get(
    routes.facebookCallback,
    passport.authenticate("facebook",{failureRedirect:"/login"}),
    postFacebookLogin
);

globalRouter.get(routes.kakao,kakaoLogin);

globalRouter.get(
  routes.kakaoCallback,
  passport.authenticate("kakao",{failureRedirect:"/login"}),
  postKakaoLogin
);

globalRouter.get(routes.google,googleLogin);

globalRouter.get(
  routes.googleCallback,
  passport.authenticate("google",{failureRedirect:"/login"}),
  postGoogleLogin
);

export default globalRouter;