import axios from 'axios';

const addCommentForm = document.getElementById('jsAddComment');
const commentList = document.getElementById('jsCommentList');
const commentNumber = document.getElementById('jsCommentNumber');
const deleteComment = document.getElementsByClassName('fa-times');

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};
const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const addComment = (comment, commentId, creatorAvatarUrl, creatorName) => {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const span1 = document.createElement('span');
  const span2 = document.createElement('span');
  const img = document.createElement('img');
  const i = document.createElement('i');
  li.id = commentId;
  li.className = 'commentBlock';
  img.className = 'commentCreator';
  img.src = creatorAvatarUrl;
  i.className = 'fas fa-times';
  li.appendChild(img);
  span.className = 'commentCreatorName';
  span.innerHTML = creatorName;
  li.appendChild(span);
  span2.className = 'commentdate';
  span2.innerHTML = '1 second ago';
  li.appendChild(span2);
  span1.className = 'commentData';
  span1.innerHTML = comment;
  li.appendChild(span1);
  li.appendChild(i);
  commentList.prepend(li);
  increaseNumber();
};

const sendComment = async comment => {
  const videoId = window.location.href.split('/videoDetail/')[1];
  const response = await axios({
    url: `/api/comment/add`,
    method: 'POST',
    data: {
      comment,
      videoId
    }
  });
  if (response.status === 200) {
    addComment(
      comment,
      response.data.commentId,
      response.data.creatorAvatarUrl,
      response.data.creatorName
    );
  }
};

const handleSubmit = event => {
  event.preventDefault(); // 새로고침 방지
  const commentInput = addCommentForm.querySelector('input');
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = '';
};

const handleDeleteComment = async event => {
  const commentId = event.target.parentNode.id;
  const videoId = window.location.href.split('/videoDetail/')[1];

  const response = await axios({
    url: `/api/comment/delete`,
    method: 'POST',
    data: {
      commentId,
      videoId
    }
  });
  if (response.status === 200) {
    event.target.parentNode.remove();
    decreaseNumber();
  }
};

function init() {
  addCommentForm.addEventListener('submit', handleSubmit);

  Array.from(deleteComment).forEach(button => {
    button.addEventListener('click', handleDeleteComment);
  });
}

if (addCommentForm) {
  init();
}
