import getBlobDuration from 'get-blob-duration';
const videoContainer = document.getElementById('jsVideoPlayer');
const videoController = document.querySelector('.videoPlayer__controls');
const videoPlayer = document.querySelector('#jsVideoPlayer video');
const playBtn = document.getElementById('jsPlayBtn');
const volumeBtn = document.querySelector('#jsVolumeBtn i');
const volumeRange = document.getElementById('jsVolume');
const fullScreenBtn = document.getElementById('jsFullScreen');
const currentTime = document.getElementById('jsCurrentTime');
const totalTime = document.getElementById('jsTotalTime');
const totalProgress = document.querySelector('#jsTotalProgress');
const currentProgress = document.querySelector('#jsCurrentProgress');
const loadProgress = document.querySelector('#jsLoadProgress');
const seek = document.querySelector('#jsSeek');
const spinner = document.getElementById('spinner');
const homeVideos = document.querySelector('.home-videos');
const searchVideos = document.querySelector('.search__videos');
const userVideos = document.querySelector('.user-videos');
const videoRelated = document.querySelector('.video__related');
const videoBlock = document.getElementsByClassName('videoBlock');
const smallBlock = document.getElementsByClassName('smallBlock');
const searchBlock = document.getElementsByClassName('searchBlock');

const registerView = () => {
  const videoId = window.location.href.split('/videoDetail/')[1];
  fetch(`/api/view/${videoId}`, {
    method: 'POST'
  });
};

let stringWidthTotalProgress;
let numberWidthTotalProgress;
let totalTimeString;
let progressInterval;
let smallProgress;
let fullProgress;
let initFlag = true;
let fullFlag = false;

const formatDate = seconds => {
  const array = [];
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  array.push(secondsNumber, `${hours}:${minutes}:${totalSeconds}`);
  return array;
};

function getProgressWidth() {
  stringWidthTotalProgress = window.getComputedStyle(totalProgress).getPropertyValue('width');
  numberWidthTotalProgress = parseFloat(stringWidthTotalProgress.split('p')[0], 10);
}

function getCurrentTime(oneSecWidth) {
  const numberCurrentTime = formatDate(videoPlayer.currentTime)[0];
  if (fullFlag) {
    const currentProgressWidth = (smallProgress / videoPlayer.duration) * numberCurrentTime;
    currentProgress.style.width = `${(currentProgressWidth * numberWidthTotalProgress) /
      smallProgress}px`;
  } else if (!fullFlag && !initFlag) {
    const currentProgressWidth = (fullProgress / videoPlayer.duration) * numberCurrentTime;
    currentProgress.style.width = `${(currentProgressWidth * numberWidthTotalProgress) /
      fullProgress}px`;
  } else if (!fullFlag && initFlag) {
    const currentProgressWidth = oneSecWidth * numberCurrentTime;
    currentProgress.style.width = `${currentProgressWidth}px`;
  }

  const ranges = [];
  for (let i = 0; i < videoPlayer.buffered.length; i++) {
    ranges.push([videoPlayer.buffered.start(i), videoPlayer.buffered.end(i)]);
  }

  let loadProgressWidth;
  for (let i = 0; i < ranges.length; i++)
    if (
      parseInt(ranges[i][0], 10) <= formatDate(videoPlayer.currentTime)[0] &&
      parseInt(ranges[i][1], 10) >= formatDate(videoPlayer.currentTime)[0]
    ) {
      if (fullFlag) {
        loadProgressWidth =
          ((smallProgress / formatDate(videoPlayer.duration)[0]) *
            parseInt(videoPlayer.buffered.end(i), 10) *
            numberWidthTotalProgress) /
          smallProgress;
      } else if (!fullFlag && !initFlag) {
        loadProgressWidth =
          ((fullProgress / formatDate(videoPlayer.duration)[0]) *
            parseInt(videoPlayer.buffered.end(i), 10) *
            numberWidthTotalProgress) /
          fullProgress;
      } else if (!fullFlag && initFlag) {
        loadProgressWidth =
          (numberWidthTotalProgress / formatDate(videoPlayer.duration)[0]) *
          parseInt(videoPlayer.buffered.end(i), 10);
      }
      loadProgress.style.width = `${loadProgressWidth}px`;
    }
  currentTime.innerHTML = formatDate(videoPlayer.currentTime)[1];
}

function setProgress(numberDuration) {
  const oneSecWidth = numberWidthTotalProgress / numberDuration;
  progressInterval = setInterval(getCurrentTime, 0, oneSecWidth);
}

async function setTotalTime() {
  let duration;
  if (!isFinite(videoPlayer.duration)) {
    const blob = await fetch(videoPlayer.src).then(response => response.blob());
    duration = await getBlobDuration(blob);
  } else {
    duration = videoPlayer.duration;
  }

  totalTimeString = formatDate(duration)[1];
  totalTime.innerHTML = totalTimeString;
  setProgress(formatDate(duration)[0]);
  videoPlayer.removeEventListener('progress', setTotalTime);
  videoPlayer.removeEventListener('mouseover', setTotalTime);
}

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeBtn.className = 'fas fa-volume-up';
    volumeRange.value = videoPlayer.volume;
  } else {
    volumeRange.value = 0;
    videoPlayer.muted = true;
    volumeBtn.className = 'fas fa-volume-mute';
  }
}

function handleDrag(event) {
  const {
    target: { value }
  } = event;

  videoPlayer.volume = value;

  if (value >= 0.6) {
    volumeBtn.className = 'fas fa-volume-up';
  } else if (value >= 0.2) {
    volumeBtn.className = 'fas fa-volume-down';
  } else {
    volumeBtn.className = 'fas fa-volume-off';
  }
}

function handleKeys(event) {
  const key = event.which || event.keyCode;

  if (key === 32) {
    handlePlayClick();
  }
}

function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function goFullScreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
}

function hideCursor() {
  videoPlayer.style.cursor = `none`;
}

function hideController() {
  videoController.style.opacity = 0;
}

function wakeUpSensing() {
  videoPlayer.addEventListener('mousemove', sensingMouse);
}

function sensingMouse() {
  videoPlayer.style.cursor = 'auto';
  videoPlayer.removeEventListener('mousemove', sensingMouse);
  const show = (videoController.style.opacity = 1);
  setTimeout(show, 5000);
  setTimeout(hideController, 6000);
  setTimeout(hideCursor, 6000);
  setTimeout(wakeUpSensing, 6000);
}
function showController() {
  const show = (videoController.style.opacity = 1);
  setTimeout(show, 5000);
}

function handleEnded() {
  if (videoPlayer.ended) {
    registerView();
    currentTime.innerHTML = totalTimeString;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    setTimeout(handlePlayClick, 2200);
  }
}

function changeScreen() {
  if (!fullFlag) {
    clearInterval(progressInterval);
    smallProgress = numberWidthTotalProgress;
    fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    fullScreenBtn.removeEventListener('click', goFullScreen);
    fullScreenBtn.addEventListener('click', exitFullScreen);
    fullFlag = true;
    setTimeout(getProgressWidth, 100);
    setTimeout(setTotalTime, 100);
  } else {
    clearInterval(progressInterval);
    fullProgress = numberWidthTotalProgress;
    fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullScreenBtn.removeEventListener('click', exitFullScreen);
    fullScreenBtn.addEventListener('click', goFullScreen);
    fullFlag = false;
    initFlag = false;
    setTimeout(getProgressWidth, 100);
    setTimeout(setTotalTime, 100);
  }
}

function handleposition(event) {
  const divX = event.offsetX - seek.offsetLeft;
  const numberCurrentTime = divX / (numberWidthTotalProgress / videoPlayer.duration);
  currentProgress.style.width = `${divX}px`;
  videoPlayer.currentTime = numberCurrentTime;
  currentTime.innerHTML = formatDate(videoPlayer.currentTime)[1];
}

function init() {
  videoPlayer.volume = 0.5;
  document.addEventListener('keydown', handleKeys);
  playBtn.addEventListener('click', handlePlayClick);
  videoPlayer.addEventListener('click', handlePlayClick);
  videoPlayer.addEventListener('ended', handleEnded);
  videoPlayer.addEventListener('mouseover', showController);
  videoController.addEventListener('mouseover', showController);
  videoController.addEventListener('mouseout', hideController);
  videoPlayer.addEventListener('mousemove', sensingMouse);
  videoPlayer.addEventListener('click', sensingMouse);
  videoPlayer.addEventListener('mouseout', hideController);
  volumeBtn.addEventListener('click', handleVolumeClick);
  volumeRange.addEventListener('input', handleDrag);

  fullScreenBtn.addEventListener('click', goFullScreen);
  document.addEventListener('fullscreenchange', changeScreen);

  seek.addEventListener('click', handleposition);
  videoPlayer.addEventListener('mouseover', setTotalTime);
  videoPlayer.addEventListener('progress', setTotalTime);
  videoPlayer.addEventListener('loadedmetadata', setTotalTime());

  videoPlayer.addEventListener('waiting', () => {
    spinner.removeAttribute('hidden');
  });
  videoPlayer.addEventListener('canplay', () => {
    spinner.setAttribute('hidden', '');
  });
}

if (videoContainer) {
  stringWidthTotalProgress = window.getComputedStyle(totalProgress).getPropertyValue('width');
  numberWidthTotalProgress = parseFloat(Math.floor(stringWidthTotalProgress.split('p')[0], 10));
  init();
}

function showPreview() {
  this.firstChild.nextSibling.firstChild.play();
}

function hidePreview() {
  this.firstChild.nextSibling.firstChild.pause();
}

function homeEvent() {
  Array.from(videoBlock).forEach(videoElement => {
    videoElement.addEventListener('mouseover', showPreview);
    videoElement.addEventListener('mouseout', hidePreview);
  });

  Array.from(searchBlock).forEach(videoElement => {
    videoElement.addEventListener('mouseover', showPreview);
    videoElement.addEventListener('mouseout', hidePreview);
  });

  Array.from(smallBlock).forEach(videoElement => {
    videoElement.addEventListener('mouseover', showPreview);
    videoElement.addEventListener('mouseout', hidePreview);
  });
}

if (homeVideos || searchVideos || userVideos || videoRelated) {
  homeEvent();
}
