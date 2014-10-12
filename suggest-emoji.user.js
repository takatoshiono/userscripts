// ==UserScript==
// @name          suggest-emoji
// @namespace     https://github.com/takatoshiono
// @description   suggest emoji from character input
// @version       0.0.1
// @author        Takatoshi Ono
// @include       https://github.com/*
// ==/UserScript==
(function(){
  var inputKeyCodes = {
    keycodes: [],

    add: function(keyCode) {
      this.keycodes.push(keyCode);
    },

    clear: function() {
      this.keycodes = [];
    }
  };

  console.log("hello, this is suggest-emoji");

  window.onload = function() {
    console.log("windows.onload");

    var ime = false;
    document.addEventListener('keydown', function(evt) {
      // IME が on のときは keydown が 229 になる
      if (evt.keyCode == 229) {
        ime = true;
      } else {
        ime = false;
      }
    }, false);

    document.getElementById('my-suggester').addEventListener('keyup', function(evt) {
      if (ime == false) { return; }
      if (evt.keyCode === 13) { // Enter
        inputKeyCodes.clear();
        return;
      } else if (evt.keyCode === 27) { // Esc
        inputKeyCodes.clear();
        return;
      }

      //console.log(this); --> textarea になる
      textareas = document.getElementsByTagName('textarea');
      for (var i = 0; i < textareas.length; i++) {
        if (this === textareas[i]) {
          console.log('matched: ' + i.toString());
        }
      }

      console.log(evt);
      inputKeyCodes.add(evt.keyCode);

      // <img class="emoji" title=":100:" alt=":100:" src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f4af.png" height="20" width="20" align="absmiddle">
      img = document.createElement('img');
      img.class = 'emoji';
      img.src = 'https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png';
      img.height = 20;
      img.width = 20;
      img.align = 'absmiddle';
      emojiArea = document.getElementById('emoji');
      emojiArea.insertBefore(img);
    }, false);
  };
})();
