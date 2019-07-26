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

const addComment = (comment, commentId) => {
  const li = document.createElement('li');
  const div = document.createElement('div');
  const span = document.createElement('span');
  const i = document.createElement('i');
  li.id = commentId;
  div.className = 'commentBlock';
  span.innerHTML = comment;
  i.className = 'fas fa-times';
  li.appendChild(div);
  div.appendChild(span);
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
    addComment(comment, response.data.commentId);
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
