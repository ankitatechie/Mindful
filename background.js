// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

let audioClip = null;
let isSoundPlaying = false;

chrome.runtime.onInstalled.addListener(function() {
  console.log("Extension is ready to use!");

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "developer.chrome.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.type == "toggleSound") {
    const { file } = request.options;
    playSound(file);
  }
});

function playSound(file) {
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
}

chrome.windows.onRemoved.addListener(function() {
  audioClip.pause();
  chrome.storage.sync.clear();
});
