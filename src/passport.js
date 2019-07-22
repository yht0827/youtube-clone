import passport from "passport";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import GoogleStrategy from "passport-google-oauth20";
import KakaoStrategy from "passport-kakao";
import User from "./models/User";
import { githubLoginCallback, facebookLoginCallback, kakaoLoginCallback, googleLoginCallback } from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());// strategy ->  로그인 하는방식  password 및 계정 인증을 검사해준다.  

passport.use(new GithubStrategy({ // github strategy등록 
    clientID:process.env.GH_ID,
    clientSecret:process.env.GH_SECRET,
    callbackURL: process.env.PRODUCTION === "true"? `https://vast-wave-24348.herokuapp.com${routes.githubCallback}`:`http://localhost:4000${routes.githubCallback}`
}, githubLoginCallback)
);

passport.use(new FacebookStrategy({
    clientID:process.env.FB_ID,
    clientSecret:process.env.FB_SECRET,
    callbackURL:process.env.PRODUCTION === "true"? `https://vast-wave-24348.herokuapp.com${routes.facebookCallback}`:`http://localhost:4000${routes.facebookCallback}`,
    profileFields:["id","displayName","photos","email"],
    scope:["public_profile","email"]
},facebookLoginCallback)
);

passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_KEY,
    callbackURL: process.env.PRODUCTION === "true"? `https://vast-wave-24348.herokuapp.com${routes.kakaoCallback}`:`http://localhost:4000${routes.kakaoCallback}`
},kakaoLoginCallback)
);

passport.use(new GoogleStrategy({
    clientID: process.env.Google_ID,
    clientSecret: process.env.Google_SECRET,
    callbackURL: process.env.PRODUCTION === "true"? `https://vast-wave-24348.herokuapp.com${routes.googleCallback}`:`http://localhost:4000${routes.googleCallback}`,
    scope: ["profile", "email"] 
},googleLoginCallback)
);

passport.serializeUser(User.serializeUser()); /* 쿠키에게 정보를 준다(Serialization), 어떤 field가 쿠키에 포함되어 있는지 알려줌, 
                                                    너무많은 정보 주면 안된다. */
passport.deserializeUser(User.deserializeUser()); // 어느사용자인지 어떻게 찾는가, 쿠키 정보를 어떻게 사용자에게 전환하는지를 의미
