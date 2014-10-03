// ==UserScript==
// @name          suggest-emoji
// @namespace     https://github.com/takatoshiono
// @description   suggest emoji from character input
// @version       0.0.1
// @author        Takatoshi Ono
// @include       https://github.com/*
// ==/UserScript==
(function(){
  console.log("hello, this is suggest-emoji");
  var ime = false;
  document.onkeydown = function(evt) {
    // IME が on のときは keydown が 229 になる
    if (evt.keyCode == 229) {
      ime = true;
    }
  };
  document.onkeyup = function(evt) {
    if (ime == false) { return; }
    console.log(evt);
  };
})();
