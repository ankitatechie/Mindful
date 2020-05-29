"use strict";

const data = [
  {
    name: "rain",
    audio: {
      btnId: "play-rain",
      eventName: "toggleAudio",
      file: "audios/rain.mp3"
    },
    graphic: {
      btnId: "show-rain",
      eventName: "toggleGraphic",
      file: "particles/js/rain.js",
      cssFile: "particles/css/rain.css"
    }
  },
  {
    name: "snow",
    audio: {
      btnId: "play-snow",
      eventName: "toggleAudio",
      file: "audios/snow.mp3"
    },
    graphic: {
      btnId: "show-snow",
      eventName: "toggleGraphic",
      file: "particles/js/snow.js"
    }
  },
  {
    name: "stars",
    audio: {
      btnId: "play-stars",
      eventName: "toggleAudio",
      file: "audios/snow.mp3"
    },
    graphic: {
      btnId: "show-stars",
      eventName: "toggleGraphic"
    }
  },
  {
    name: "om",
    audio: {
      btnId: "play-om",
      eventName: "toggleAudio",
      file: "audios/om.mp3"
    },
    graphic: {
      btnId: "show-om",
      eventName: "toggleGraphic"
    }
  },
  {
    name: "piano",
    audio: {
      btnId: "play-piano",
      eventName: "toggleAudio",
      file: "audios/piano.mp3"
    },
    graphic: {
      btnId: "show-piano",
      eventName: "toggleGraphic"
    }
  }
];

function runAnimation(file, cssFile = false) {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.executeScript(activeTab.id, { file });
    if (cssFile) {
      chrome.tabs.insertCSS((activeTab.id, { file: cssFile }));
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
  for (let obj of data) {
    const playBtn = document.getElementById(obj.audio.btnId);
    const graphicBtn = document.getElementById(obj.graphic.btnId);
    if (playBtn) {
      playBtn.addEventListener("click", e => {
        playSound(chrome.runtime.getURL(obj.audio.file), true);
      });
    }

    if (graphicBtn) {
      graphicBtn.addEventListener("click", e => {
        runAnimation(obj.graphic.file, obj.graphic.cssFile);
      });
    }
  }
});
