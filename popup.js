"use strict";

const data = [
  {
    name: "rain",
    audio: {
      btnId: "play-rain",
      file: "audios/rain.mp3"
    },
    graphic: {
      btnId: "show-rain",
      file: "particles/js/rain.js",
      cssFile: "particles/css/rain.css"
    }
  },
  {
    name: "snow",
    audio: {
      btnId: "play-snow",
      file: "audios/snow.mp3"
    },
    graphic: {
      btnId: "show-snow",
      file: "particles/js/snow.js"
    }
  },
  {
    name: "stars",
    audio: {
      btnId: "play-stars",
      file: "audios/snow.mp3"
    },
    graphic: {
      btnId: "show-stars"
    }
  },
  {
    name: "om",
    audio: {
      btnId: "play-om",
      file: "audios/om.mp3"
    },
    graphic: {
      btnId: "show-om"
    }
  },
  {
    name: "piano",
    audio: {
      btnId: "play-piano",
      file: "audios/piano.mp3"
    },
    graphic: {
      btnId: "show-piano"
    }
  }
];

var currentAudio = null;

function runAnimation(file, cssFile = false) {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.executeScript(activeTab.id, { file });
    if (cssFile) {
      chrome.tabs.insertCSS((activeTab.id, { file: cssFile }));
    }
  });
}

function togglePlayBtn(playBtn) {
  if (playBtn.classList.length === 1) {
    playBtn.className = "play-btn stop-btn";
  } else {
    chrome.storage.sync.set({ audioClip: currentAudio });
    playBtn.className = "play-btn";
  }
}

function playSound(file, playBtn) {
  // toggle play and stop button when popup is already in open state
  togglePlayBtn(playBtn);

  chrome.runtime.sendMessage({
    type: "toggleSound",
    options: {
      file: file
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  for (let obj of data) {
    const playBtn = document.getElementById(obj.audio.btnId);
    const graphicBtn = document.getElementById(obj.graphic.btnId);
    if (playBtn) {
      // when popup renders first time, check which sound is already playing
      // and then show stop button accordingly
      chrome.storage.sync.get(["audioClip", "isSoundPlaying"], function(
        result
      ) {
        if (result.audioClip === obj.audio.file && result.isSoundPlaying) {
          togglePlayBtn(playBtn);
        }
      });

      playBtn.addEventListener("click", e => {
        currentAudio = obj.audio.file;
        playSound(chrome.runtime.getURL(obj.audio.file), playBtn);
      });
    }

    if (graphicBtn) {
      graphicBtn.addEventListener("click", e => {
        runAnimation(obj.graphic.file, obj.graphic.cssFile);
      });
    }
  }
});
