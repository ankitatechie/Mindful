// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

// pause all the non active buttons
function pauseAllBtn(playBtn) {
  for (let obj of data) {
    const _playBtn = document.getElementById(obj.audio.btnId);
    if (obj.audio.btnId !== playBtn.id) {
      _playBtn.className = "play-btn";
    }
  }
}

function changePlayBtnClass(playBtn, className) {
  playBtn.className = className;
}

function playSound(type, file) {
  chrome.runtime.sendMessage({
    type: type,
    file
  });
}

function getButtonID(file) {
  return file
    .split("/")
    .pop()
    .split(".")[0];
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  switch (request.type) {
    case "PAUSE_BUTTON":
      {
        let playBtnId = request.lastPlayedFile
          ? getButtonID(request.lastPlayedFile)
          : null;

        if (playBtnId) {
          changePlayBtnClass(
            document.getElementById("play-" + playBtnId),
            "play-btn"
          );
        }
      }

      break;
    case "PLAY_BUTTON":
      {
        let playBtnId = request.lastPlayedFile
          ? getButtonID(request.lastPlayedFile)
          : null;

        if (playBtnId) {
          changePlayBtnClass(
            document.getElementById("play-" + playBtnId),
            "play-btn stop-btn"
          );
        }
      }

      break;
    default:
      break;
  }
});

function onPlay(playBtn, file, currentAudio) {
  console.log(playBtn, file, currentAudio);
  playSound("PLAY_SOUND", file);
  if (currentAudio) {
    chrome.storage.sync.set({ audioClip: currentAudio });
  }
  if (playBtn) {
    changePlayBtnClass(playBtn, "play-btn stop-btn");
    pauseAllBtn(playBtn);
  }
}

function togglePlayBtn(playBtn, file, currentAudio) {
  if (playBtn.classList.length === 1) {
    // sound was in playing state, it will switch icon to pause mode
    onPlay(playBtn, file, currentAudio);
  } else {
    changePlayBtnClass(playBtn, "play-btn");
    playSound("PLAY_SOUND", file);
  }
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
          changePlayBtnClass(playBtn, "play-btn stop-btn");
        }
      });

      playBtn.addEventListener("click", function() {
        currentAudio = obj.audio.file;
        togglePlayBtn(
          playBtn,
          chrome.runtime.getURL(obj.audio.file),
          currentAudio
        );
      });
    }

    if (graphicBtn) {
      // When graphics button is clicked, ALWAYS play sound
      graphicBtn.addEventListener("click", function() {
        currentAudio = obj.audio.file;
        onPlay(playBtn, chrome.runtime.getURL(obj.audio.file), currentAudio);
        chrome.runtime.sendMessage({
          type: "OPEN_TAB",
          name: obj.name
        });
      });
    }
  }
});

var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-168248742-1"]);
_gaq.push(["_trackPageview"]);

(function() {
  var ga = document.createElement("script");
  ga.type = "text/javascript";
  ga.async = true;
  ga.src = "https://ssl.google-analytics.com/ga.js";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(ga, s);
})();

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
    name: "fireflies",
    audio: {
      btnId: "play-fireflies",
      file: "audios/fireflies.mp3"
    },
    graphic: {
      btnId: "show-fireflies",
      file: "particles/js/particles.js"
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
    name: "flute",
    audio: {
      btnId: "play-flute",
      file: "audios/flute.mp3"
    },
    graphic: {
      btnId: "show-flute"
    }
  },
  {
    name: "chakra",
    audio: {
      btnId: "play-chakra",
      file: "audios/bowl.mp3"
    },
    graphic: {
      btnId: "show-chakra"
    }
  }
];
