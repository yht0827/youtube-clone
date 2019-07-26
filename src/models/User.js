import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatarUrl: {
    type: String,
    default: 'https://heetube.s3.ap-northeast-2.amazonaws.com/avatar/facebook-avatar.jpg'
  },
  facebookId: Number,
  githubId: Number,
  kakaoId: Number,
  googleId: Number,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    }
  ]
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' }); // 패스워드 설정 및 패스워드 확인등 관리 해준다. email을 유저네임 필드로 설정

const model = mongoose.model('User', UserSchema); // User 모델 생성

export default model;
