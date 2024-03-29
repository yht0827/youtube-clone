import passport from 'passport';
import routes from '../routes';
import User from '../models/User';

export const getJoin = (req, res) => {
  res.render('join', {
    pageTitle: 'Sign Up'
  });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    req.flash('error', "Password don't match");
    res.status(400);
    res.render('join', {
      pageTitle: 'Sign Up'
    });
  } else {
    try {
      const user = await User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (error) {
      req.flash('error', 'A user already registered');
      res.status(400);
      res.render('join', {
        pageTitle: 'Sign Up'
      });
    }
  }
};

export const getLogin = (req, res) =>
  res.render('login', {
    pageTitle: 'Sign In'
  });
export const postLogin = passport.authenticate('local', {
  // local로그인
  failureRedirect: routes.login,
  successRedirect: routes.home,
  failureFlash: "Can't Log In",
  successFlash: 'Welcome'
});

export const githubLogin = passport.authenticate('github'); // github 버튼 눌렀을 시

export const githubLoginCallback = async (_, __, profile, cb) => {
  // github페이지에서 돌아오면서 사용자 정보를 얻게 된다.

  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // 특정 이용자가 이미 해당 email을 사용하고 있는 경우 githubId로 갱신해줌
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogIn = (req, res) => {
  // github 로그인 성공시 실행
  res.redirect(routes.home);
};
export const googleLogin = passport.authenticate('google');

export const googleLoginCallback = async (accessToken, refreshToken, profile, cb) => {
  const {
    _json: { sub: id, name, picture: avatarUrl, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.googleId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      googleId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGoogleLogin = (req, res) => {
  res.redirect(routes.home);
};

export const kakaoLogin = passport.authenticate('kakao');

export const kakaoLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: {
      id,
      kaccount_email: email,
      properties: { nickname }
    }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.kakaoId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name: nickname,
      kakaoId: id,
      avatarUrl: 'https://heetube.s3.ap-northeast-2.amazonaws.com/avatar/facebook-avatar.jpg'
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postKakaoLogin = (req, res) => {
  res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate('facebook');

export const facebookLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email }
  } = profile;

  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.flash('info', 'Bye Bye');
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).populate('videos');
  res.render('userDetail', { pageTitle: 'My Channel', user });
};
export const userDetail = async (req, res) => {
  const {
    params: { userId }
  } = req;
  try {
    const user = await User.findById(userId).populate('videos');
    res.render('userDetail', {
      pageTitle: `${user.name}'s Channel`,
      user
    });
  } catch (error) {
    req.flash('error', 'User not found');
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) =>
  res.render('editProfile', {
    pageTitle: 'Edit Profile'
  });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl
    });
    req.flash('success', 'Profile updated');
    res.redirect(routes.me);
  } catch (error) {
    req.flash('error', "Can't Update Profile");
    res.rendirect(routes.editProfile);
  }
};
export const getChangePassword = (req, res) =>
  res.render('changePassword', {
    pageTitle: 'Change Password'
  });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;

  try {
    if (newPassword !== newPassword1) {
      req.flash('error', "Passwords don't match");
      res.status(400);
      res.redirect(routes.changePassword);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    req.flash('success', 'Password Changed');
    req.redirect(routes.me);
  } catch (error) {
    res.status(400);
    req.flash('error', "Can't Change Password");
    res.render(routes.changePassword);
  }
};
