// popup.js


document.addEventListener("DOMContentLoaded", () => {
    const speedSelect = document.getElementById("speed-select");
  
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length === 0) return;
      
      const tab = tabs[0];
      if (!tab.url || !tab.url.includes("youtube.com")) {
        return;
      }
  
      chrome.tabs.sendMessage(
        tab.id,
        { action: "getSpeed" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.log("Error getting speed:", chrome.runtime.lastError.message);
            speedSelect.value = "1";
          } else if (response && response.speed) {
            console.log("Got speed:", response.speed);
            speedSelect.value = response.speed.toString();
          }
        }
      );
    });

    speedSelect.addEventListener("change", () => {
      const newSpeed = parseFloat(speedSelect.value);
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
        
        const tab = tabs[0];
        if (!tab.url || !tab.url.includes("youtube.com")) return;
        
        chrome.tabs.sendMessage(
          tab.id,
          { action: "setSpeed", speed: newSpeed },
          (response) => {
            if (chrome.runtime.lastError) {
              console.log("Error setting speed:", chrome.runtime.lastError.message);
            }
          }
        );
      });
    });
  });