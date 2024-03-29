import aws from 'aws-sdk';
import routes from '../routes';
import Video from '../models/Video';
import Comment from '../models/Comment';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: 'ap-northeast-2'
});

export const getUpload = (req, res) => res.render('upload', { pageTitle: 'Upload' });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location }
  } = req;

  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  req.flash('success', 'Video Uploaded');
  res.redirect(`${routes.videoDetail}/${newVideo.id}`);
};

export const videoDetail = async (req, res) => {
  const {
    params: { id }
  } = req;

  try {
    const video = await Video.findById(id)
      .populate('creator')
      .populate('comments');
    const videos = await Video.find({})
      .sort({
        _id: -1
      })
      .populate('creator');
    // populate는 객체만 가져올수 있다. join과 같은 개념

    res.render('videoDetail', {
      pageTitle: video.title,
      video,
      videos
    });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      res.render('editVideo', {
        pageTitle: `Edit ${video.title}`,
        video
      });
    }
  } catch (error) {
    req.flash('error', 'Video not found');
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findOneAndUpdate(
      {
        _id: id
      },
      {
        title,
        description
      }
    );
    req.flash('success', 'Video updated');
    res.redirect(`${routes.videoDetail}/${id}`);
  } catch (error) {
    req.flash('error', "Can't Update Video");
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  const video = await Video.findById(id)
    .populate('creator')
    .populate('comments');
  const tmpArray = video.fileUrl.split('/');
  const fileName = tmpArray[tmpArray.length - 1];

  try {
    if (String(video.creator.id) !== req.user.id) {
      throw Error();
    } else {
      const params = {
        Bucket: 'heetube/video',
        Key: fileName
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.log('video delete error!');
        } else {
          console.log('video delete sucess');
          console.log(data);
        }
      });
      video.comments.forEach(async element => {
        await Comment.findOneAndRemove({ _id: element });
      });
      await video.remove();

      req.flash('success', 'Video deleted');
    }
  } catch (error) {
    req.flash('error', "Can't Delete Video");
    console.log(error);
  }
  res.redirect(routes.home);
};

// Register Video View

export const registerView = async (req, res) => {
  const {
    params: { videoId }
  } = req;
  try {
    const video = await Video.findById(videoId);

    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// Add Comment

export const postAddComment = async (req, res) => {
  const {
    body: { videoId, comment },
    user
  } = req;
  try {
    const video = await Video.findById(videoId);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
      creatorAvatarUrl: user.avatarUrl,
      creatorName: user.name
    });
    console.log(user);
    video.comments.push(newComment.id);
    await video.save();
    res.send({
      commentId: newComment.id,
      creatorAvatarUrl: user.avatarUrl,
      creatorName: user.name
    });
  } catch (error) {
    res.status(400);
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    body: { videoId, commentId },
    user
  } = req;

  console.log(videoId);
  console.log(commentId);

  try {
    const video = await Video.findById(videoId);
    const comment = await Comment.findById(commentId);

    if (comment.creator.toString() === user.id) {
      await comment.remove();
      await video.comments.remove(commentId);
      await video.save();
    }
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
