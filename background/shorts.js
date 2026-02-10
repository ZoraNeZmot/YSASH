// shorts.js


let isBlockingShorts = true;

// Function to check if we're on Shorts
function isShortsPage() {
  return window.location.pathname.includes("/shorts/");
}

function redirectFromShorts() {
  if (isShortsPage() && isBlockingShorts) {
    console.log("Blocking YouTube Shorts, redirecting...");
    
    // Store current scroll position before redirecting (if coming from homepage)
    if (document.referrer && document.referrer.includes("youtube.com")) {
      try {
        const scrollPosition = window.scrollY;
        sessionStorage.setItem('youtubeScrollPosition', scrollPosition);
      } catch (e) {
        console.log("Could not save scroll position");
      }
    }
    
    // Redirect to YouTube homepage
    window.location.replace("https://www.youtube.com");
    return true;
  }
  return false;
}

if (isShortsPage()) {
  redirectFromShorts();
}


let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    if (isShortsPage()) {
      redirectFromShorts();
    }
  }
}).observe(document, { subtree: true, childList: true });


window.addEventListener('popstate', () => {
  if (isShortsPage()) {
    redirectFromShorts();
  }
});

window.addEventListener('load', () => {
  if (!isShortsPage() && sessionStorage.getItem('youtubeScrollPosition')) {
    try {
      const scrollPosition = parseInt(sessionStorage.getItem('youtubeScrollPosition'));
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
        sessionStorage.removeItem('youtubeScrollPosition');
      }, 500);
    } catch (e) {
      console.log("Could not restore scroll position");
    }
  }
});