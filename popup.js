// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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
      file: "particles/js/particles.js"
    }
  },
  {
    name: "stars",
    audio: {
      btnId: "play-stars",
      file: "audios/stars.mp3"
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
  },
  {
    name: "fireflies",
    audio: {
      btnId: "play-fireflies",
      file: "audios/fireflies.mp3"
    },
    graphic: {
      btnId: "show-fireflies",
      file: "particles/js/particles.js"
    }
  }
];

function openTab(name) {
  chrome.tabs.create({
    url: chrome.extension.getURL(`particles/html/${name}.html`)
  });
}

function togglePlayBtn(playBtn, currentAudio) {
  if (playBtn.classList.length === 1) {
    // sound was in playing state, it will switch icon to pause mode
    if (currentAudio) {
      chrome.storage.sync.set({ audioClip: currentAudio });
    }
    playBtn.className = "play-btn stop-btn";
  } else {
    // sound was in pasue state, it will switch icon to play mode
    playBtn.className = "play-btn";
  }
}

function pausePlayBtn(playBtn) {
  for (let obj of data) {
    const _playBtn = document.getElementById(obj.audio.btnId);
    if (obj.audio.btnId !== playBtn.id) {
      _playBtn.className = "play-btn";
    }
  }
}

function playSound(file, playBtn, currentAudio) {
  // toggle play and stop button when popup is already in open state
  togglePlayBtn(playBtn, currentAudio);
  pausePlayBtn(playBtn);
  chrome.runtime.sendMessage({
    type: "toggleSound",
    options: {
      file: file
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  var currentAudio = null;
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
        playSound(chrome.runtime.getURL(obj.audio.file), playBtn, currentAudio);
      });
    }

    if (graphicBtn) {
      graphicBtn.addEventListener("click", () => {
        openTab(obj.name);
      });
    }
  }
});
