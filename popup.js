"use strict";

function runAnimation(file, cssFileName = false) {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.executeScript(activeTab.id, { file });
    if (cssFileName) {
      chrome.tabs.insertCSS((activeTab.id, { file: cssFileName }));
    }
  });
}

function playSound(file, play = true) {
  chrome.runtime.sendMessage({
    type: "playSound",
    options: {
      file: file,
      play: play
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  let showSnow = document.getElementById("show-snow");
  let showRain = document.getElementById("show-rain");
  let playRainSound = document.getElementById("play-rain");

  showSnow.addEventListener("click", () =>
    runAnimation("particles/js/snow.js")
  );
  showRain.addEventListener("click", () =>
    runAnimation("particles/js/rain.js", "particles/css/rain.css")
  );

  playRainSound.addEventListener("click", () =>
    playSound(chrome.runtime.getURL("audios/om.mp3"), true)
  );
});
