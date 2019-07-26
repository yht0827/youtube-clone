// Global
const HOME = '/';
const SEARCH = '/search';

const LOGIN = '/login';
const LOGOUT = '/logout';
const JOIN = '/join';

// Users
const UPLOAD = '/upload';
const USER_DETAIL = '/profile/:userId';
const EDIT_PROFILE = '/edit-profile';
const CHANGE_PASSWORD = '/change-password';
const ME = '/me';

// Videos
const VIDEO_DETAIL = '/videoDetail';
const EDIT_VIDEO = '/edit';
const DELETE_VIDEO = '/delete';

// Github
const GITHUB = '/auth/github';
const GITHUB_CALLBACK = '/auth/github/callback';

// Facebook

const FB = '/auth/facebook';
const FB_CALLBACK = '/auth/facebook/callback';

// Naver

const NAVER = '/auth/naver';
const NAVER_CALLBACK = '/auth/naver/callback';

// Kakao

const KAKAO = '/auth/kakao';
const KAKAO_CALLBACK = '/auth/kakao/callback';

// Google

const GOOGLE = '/auth/google';
const GOOGLE_CALLBACK = '/auth/google/callback';

// API

const REGISTER_VIEW = '/view/:videoId';
const ADD_COMMENT = '/comment/add';
const DELETE_COMMENT = '/comment/delete';

const routes = {
  home: HOME,
  join: JOIN,
  upload: UPLOAD,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  userDetail: USER_DETAIL,
  editProfile: EDIT_PROFILE,
  changePassword: CHANGE_PASSWORD,
  videoDetail: VIDEO_DETAIL,
  editVideo: EDIT_VIDEO,
  deleteVideo: DELETE_VIDEO,
  gitHub: GITHUB,
  githubCallback: GITHUB_CALLBACK,
  me: ME,
  facebook: FB,
  facebookCallback: FB_CALLBACK,
  naver: NAVER,
  naverCallback: NAVER_CALLBACK,
  kakao: KAKAO,
  kakaoCallback: KAKAO_CALLBACK,
  google: GOOGLE,
  googleCallback: GOOGLE_CALLBACK,
  registerView: REGISTER_VIEW,
  addComment: ADD_COMMENT,
  deleteComment: DELETE_COMMENT
};

export default routes;
