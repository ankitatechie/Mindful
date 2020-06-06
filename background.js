"use strict";

let audioClip = null;
let isSoundPlaying = false;

function openTab(name) {
  chrome.tabs.create({
    url: chrome.extension.getURL(`particles/html/${name}.html`),
    active: true
  });
}

function playBackgroundSound(file) {
  if (audioClip) {
    audioClip.pause();

    // stop the same audio playing
    if (audioClip.src === file && isSoundPlaying == true) {
      isSoundPlaying = false;
      chrome.storage.sync.set({ isSoundPlaying: false });
      return;
    }
  }
  audioClip = new Audio(file);
  audioClip.loop = true;
  audioClip.play();
  isSoundPlaying = true;
  chrome.storage.sync.set({ isSoundPlaying: true });

  // gapless looping of audio
  audioClip.addEventListener("timeupdate", () => {
    const buffer = 0.44;
    if (audioClip.currentTime > audioClip.duration - buffer) {
      audioClip.currentTime = 0;
      audioClip.play();
    }
  });

  audioClip.addEventListener("pause", () => {
    chrome.storage.sync.set({ isSoundPlaying: false });
    chrome.runtime.sendMessage({
      type: "PAUSE_BUTTON",
      lastPlayedFile: audioClip.currentSrc
    });
  });
  audioClip.addEventListener("play", () => {
    chrome.storage.sync.set({ isSoundPlaying: true });
    chrome.runtime.sendMessage({
      type: "PLAY_BUTTON",
      lastPlayedFile: audioClip.currentSrc
    });
  });
}

chrome.windows.onRemoved.addListener(function() {
  audioClip.pause();
  chrome.storage.sync.clear();
});

chrome.runtime.onMessage.addListener(function(request) {
  switch (request.type) {
    case "OPEN_TAB":
      openTab(request.name);
      break;
    case "PLAY_SOUND":
      {
        playBackgroundSound(request.file);
      }
      break;
    default:
      break;
  }
});
