import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: 'Text is required'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  creatorAvatarUrl: {
    type: String,
    default: 'https://heetube.s3.ap-northeast-2.amazonaws.com/avatar/facebook-avatar.jpg'
  },
  creatorName: {
    type: String,
    required: 'required'
  }
});

const model = mongoose.model('Comment', CommentSchema);
export default model;
