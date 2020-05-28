// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

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
  if (request.type == "playSound") {
    const { file, play } = request.options;
    playSound(file, play);
  }
});

function playSound(file, play = true) {
  var y = new Audio(file);
  if (play) {
    y.play();
  } else {
    y.pause();
  }
}
