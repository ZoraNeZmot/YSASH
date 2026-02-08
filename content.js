// content.js



/**
 * @returns {number}
 */
function getCurrentSpeed() {
    const video = document.querySelector("video");
    return video ? video.playbackRate : 1;
}

/**
 * 
 * @param {number} speed 
 * @returns {number}
 */
function setSpeed(speed) {
    const video = document.querySelector("video");
    if (video) {
      video.playbackRate = speed;
    }
    saveSpeed(speed);
    return speed;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getSpeed") {
      sendResponse({ speed: getCurrentSpeed() });
    } else if (message.action === "setSpeed") {
      sendResponse({ speed: setSpeed(message.speed) });
    }
    return true;
});

/**
 * @param {number} speed 
 */
function saveSpeed(speed) {
  const temp = sessionStorage.getItem("yt-player-playback-rate")
  if (!temp || Number.parseInt(temp) !== speed) {
    sessionStorage.setItem("yt-player-playback-rate", JSON.stringify({data: speed.toString(), creation: Date.now()}));
  }
}

/**
 * @returns {number} 
 */
function downloadSpeed() {
  const sp = sessionStorage.getItem("yt-player-playback-rate");
  if (sp) {
    return setSpeed(Number.parseInt(sp));
  }
  return 1
}




document.addEventListener("DOMContentLoaded", ()=>{
  setTimeout(()=>{
    const speed = downloadSpeed();
    if (speed !== 1) {
      setSpeed(1);
    }
  }, 100);

});