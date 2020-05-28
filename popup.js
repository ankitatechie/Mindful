// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

function runAnimation(file) {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.executeScript(activeTab.id, { file });
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
    runAnimation("particles/js/rain.js")
  );

  playRainSound.addEventListener("click", () =>
    playSound(chrome.runtime.getURL("audios/om.mp3"), true)
  );
});
