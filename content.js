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
async function saveSpeed(speed) {
  const temp = await chrome.storage.session.get("yt-player-playback-rate");
  alert("saveSpeed");
  if (!temp || Number.parseInt(temp) !== speed) {
    chrome.storage.session.set("yt-player-playback-rate", JSON.stringify({data: speed.toString(), creation: Date.now()}))
  }
}

/**
 * @returns {Promise<number>} 
 */
async function downloadSpeed() {
  const sp = await chrome.storage.session.get("yt-player-playback-rate");
  if (sp) {
    return setSpeed(Number.parseInt(sp));
  }
  return 1
}




document.addEventListener("DOMContentLoaded", ()=>{
  setTimeout(async ()=>{
    const speed = await downloadSpeed();
    if (speed !== 1) {
      setSpeed(1);
    }
  }, 100);

});