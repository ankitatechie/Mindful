// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

let showSnow = document.getElementById("show-snow");
let showRain = document.getElementById("show-rain");

function addSnow() {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { message: "runSnow" });
  });
}
function addRain() {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { message: "runRain" });
  });
}
document.addEventListener("DOMContentLoaded", function() {
  showSnow.addEventListener("click", addSnow);
  showRain.addEventListener("click", addRain);
  // chrome.tabs.sendMessage(null, { message: "changeBackground" });
});
