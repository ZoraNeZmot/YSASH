/**
 * Sets the speed with a retry mechanism because YT 
 * takes a moment to swap video elements.
 */
async function setSpeedWithRetry(speed, retries = 5) {
  const video = document.querySelector("video");
  
  if (video) {
    video.playbackRate = speed;
    console.log(`Speed set to: ${speed}`);
  } else if (retries > 0) {
    // Wait 500ms and try again
    setTimeout(() => setSpeedWithRetry(speed, retries - 1), 500);
  }
}

async function saveSpeed(speed) {
  const key = "yt-player-playback-rate";
  const data = { data: speed.toString(), creation: Date.now() };
  // Changed to chrome.storage.local
  await chrome.storage.local.set({ [key]: JSON.stringify(data) });
}

async function applyStoredSpeed() {
  const result = await chrome.storage.local.get("yt-player-playback-rate");
  const storedData = result["yt-player-playback-rate"];
  
  if (storedData) {
    const parsed = JSON.parse(storedData);
    const speed = parseFloat(parsed.data);
    setSpeedWithRetry(speed);
  }
}

// Listener for Popup messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getSpeed") {
    const video = document.querySelector("video");
    sendResponse({ speed: video ? video.playbackRate : 1 });
  } else if (message.action === "setSpeed") {
    setSpeedWithRetry(message.speed);
    saveSpeed(message.speed);
    sendResponse({ speed: message.speed });
  }
  return true;
});

// Run when navigating to a new video
document.addEventListener("yt-navigate-finish", () => {
  if (location.pathname === "/watch") {
    applyStoredSpeed();
  }
});

// Initial run for first load
if (location.pathname === "/watch") {
  applyStoredSpeed();
}