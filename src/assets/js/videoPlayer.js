import getBlobDuration from "get-blob-duration";
const videoContainer = document.getElementById("jsVideoPlayer");
const videoController = document.querySelector(".videoPlayer__controls");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayBtn");
const volumeBtn = document.querySelector("#jsVolumeBtn i");
const volumeRange = document.getElementById("jsVolume");
const fullScreenBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("jsCurrentTime");
const totalTime = document.getElementById("jsTotalTime");
const totalProgress = document.querySelector("#jsTotalProgress");
const currentProgress = document.querySelector("#jsCurrentProgress");
const seek = document.querySelector("#jsSeek");
const vid = document.getElementById("myVideo");
const spinner = document.getElementById("spinner");

const registerView = () => {
  const videoId= window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`,{
    method:"POST"
  });
}

let stringWidthTotalProgress = window.getComputedStyle(totalProgress).getPropertyValue("width");
  let numberWidthTotalProgress = parseFloat(Math.floor(
    stringWidthTotalProgress.split("p")[0],
    10)
    );
let totalTimeString;
let progressInterval;

let smallProgress;
let fullProgress;

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
  if (seconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  array.push(secondsNumber, `${hours}:${minutes}:${totalSeconds}`);
  return array;
};

function getProgressWidth() {
  stringWidthTotalProgress = window
    .getComputedStyle(totalProgress)
    .getPropertyValue("width");
  numberWidthTotalProgress = parseFloat(
    stringWidthTotalProgress.split("p")[0],
    10
  );
}

function getCurrentTime(oneSecWidth) {
  const numberCurrentTime = formatDate(videoPlayer.currentTime)[0];
  const currentProgressWidth = oneSecWidth * numberCurrentTime;
  currentProgress.style.width = `${currentProgressWidth}px`;
  currentTime.innerHTML = formatDate(videoPlayer.currentTime)[1];
}

function setProgress(numberDuration) {
  const oneSecWidth = numberWidthTotalProgress / numberDuration;
  progressInterval = setInterval(getCurrentTime,0, oneSecWidth);
}

 function setTotalTime() {
  let duration;

  if (!isFinite(videoPlayer.duration)) {
    const blob =  fetch(videoPlayer.src).then(response => response.blob());
    duration =  getBlobDuration(blob);
  } else {
    duration = videoPlayer.duration;
  }
  
  totalTimeString = formatDate(duration)[1];
  totalTime.innerHTML = totalTimeString;
  setProgress(formatDate(duration)[0]);
  videoPlayer.removeEventListener("progress", setTotalTime);
  videoPlayer.removeEventListener("mouseover", setTotalTime);
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
    volumeBtn.className = "fas fa-volume-up";
    volumeRange.value = videoPlayer.volume;
  } else {
    volumeRange.value = 0;
    videoPlayer.muted = true;
    volumeBtn.className = "fas fa-volume-mute";
  }
}

function handleDrag(event) {
  const {
    target: { value }
  } = event;

  videoPlayer.volume = value;

  if (value >= 0.6) {
    volumeBtn.className = "fas fa-volume-up";
  } else if (value >= 0.2) {
    volumeBtn.className = "fas fa-volume-down";
  } else {
    volumeBtn.className = "fas fa-volume-off";
  }
}

function handleKeys(event) {
  const key = event.which || event.keyCode;
  if (key === 32) {
    handlePlayClick();
  }
}

 function exitFullScreen() {
  clearInterval(progressInterval);
  fullProgress=numberWidthTotalProgress;
  const numberCurrentTime = formatDate(videoPlayer.currentTime)[0];
  const currentProgressWidth = (fullProgress/ videoPlayer.duration) * numberCurrentTime;
  currentProgress.style.width = `${(currentProgressWidth *smallProgress)/fullProgress}px`;
  fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
  
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  
  fullScreenBtn.addEventListener("click", goFullScreen);
  fullScreenBtn.removeEventListener("click", exitFullScreen);
  setTimeout(getProgressWidth, 100);
  setTimeout(setTotalTime, 100);
}

function goFullScreen() {
  clearInterval(progressInterval);
  smallProgress=numberWidthTotalProgress;
  const numberCurrentTime = formatDate(videoPlayer.currentTime)[0];
  const currentProgressWidth = (smallProgress/ videoPlayer.duration) * numberCurrentTime;
    currentProgress.style.width = `${(currentProgressWidth * fullProgress)/smallProgress}px`;

  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }

  fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScreenBtn.removeEventListener("click", goFullScreen);
  fullScreenBtn.addEventListener("click", exitFullScreen);

  setTimeout(getProgressWidth, 100);
  setTimeout(setTotalTime, 100);
}

function hideCursor() {
  videoPlayer.style.cursor = `none`;
}

function hideController() {
  videoController.style.opacity = 0;
}

function wakeUpSensing() {
  videoPlayer.addEventListener("mousemove", sensingMouse);
}

function sensingMouse() {
  videoPlayer.style.cursor = "auto";
  videoPlayer.removeEventListener("mousemove", sensingMouse);
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

function handleposition(event){
   const divX= event.offsetX-seek.offsetLeft;
   const numberCurrentTime = divX/ (numberWidthTotalProgress / videoPlayer.duration);
    currentProgress.style.width = `${divX}px`;
    videoPlayer.currentTime= numberCurrentTime ;
    currentTime.innerHTML = formatDate(videoPlayer.currentTime)[1];
}

  function init() {
    videoPlayer.volume = 0.5;
    document.addEventListener("keydown", handleKeys);
    playBtn.addEventListener("click", handlePlayClick);
    videoPlayer.addEventListener("click", handlePlayClick);
    videoPlayer.addEventListener("ended", handleEnded);
    videoPlayer.addEventListener("mouseover", showController);
    videoController.addEventListener("mouseover", showController);
    videoController.addEventListener("mouseout", hideController);
    videoPlayer.addEventListener("mousemove", sensingMouse);
    videoPlayer.addEventListener("click", sensingMouse);
    videoPlayer.addEventListener("mouseout", hideController);
    volumeBtn.addEventListener("click", handleVolumeClick);
    volumeRange.addEventListener("input", handleDrag);
    fullScreenBtn.addEventListener("click", goFullScreen);
    
    seek.addEventListener("click",handleposition);
    videoPlayer.addEventListener("mouseover", setTotalTime);
    videoPlayer.addEventListener("progress", setTotalTime);
    videoPlayer.addEventListener("loadedmetadata", setTotalTime);

    vid.addEventListener('waiting', (event) => {
      spinner.removeAttribute('hidden');
      console.log('Video is waiting for more data.');
      console.log(event);
    });

    vid.addEventListener('canplay', (event) => {
      spinner.setAttribute('hidden', '');
      console.log('Video can start, but not sure it will play through.');
      console.log(event);
    });



  }
  if (videoContainer) {
    init();
  }
