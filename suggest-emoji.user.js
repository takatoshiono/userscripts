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

      // その親要素が持つ div.suggester-container を取得
      var suggesterContainer = getChildNode(this.parentNode, 'DIV', 'suggester-container');
      if (typeof suggesterContainer === 'undefined') { return; }
      console.log(suggesterContainer);

      // その中に div.suggester > ul.emoji-suggestions があるか確認
      var suggester = getChildNode(suggesterContainer, 'DIV', 'suggester');
      if (typeof suggester === 'undefined') { return; }
      console.log(suggester);

      var emojiSuggestions = getChildNode(suggester, 'UL', 'emoji-suggestions');
      if (typeof emojiSuggestions === 'undefined') {
        // suggester の中にul.emoji-suggestionsを作る
        console.log('create');
        emojiSuggestions = document.createElement('ul');
        emojiSuggestions.className = 'emoji-suggestions';
        emojiSuggestions.style.display = 'none';
        suggester.insertBefore(emojiSuggestions);
      } else {
        // li 要素を削除する
        console.log('delete');
        var jsNavigationItems = emojiSuggestions.children;
        for (var i = 0; i < children.length; i++) {
          emojiSuggestions.removeChild(children[i]);
        }
      }

      // suggest したい li を作る
      navigationItem = createEmojiElement('+1');
      console.log(navigationItem);

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

  function getChildNode(element, tagName, className) {
    console.log(element);
    if (!element.hasChildNodes()) { return; }
    var children = element.children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].tagName === tagName
          && children[i].className.indexOf(className) !== -1
      ) {
        console.log("found");
        return children[i];
      }
    }
    return;
  }

  // <li class="js-navigation-item navigation-focus" data-value="8ball" data-text="8ball pool billiards">
  //   <span class="emoji-icon" style="background-image:url(https://assets-cdn.github.com/images/icons/emoji/unicode/1f3b1.png)"></span>
  //   8ball
  // </li>
  function createEmojiElement(emojiName) {
    var icon = document.createElement('span');
    icon.className = 'emoji-icon';
    icon.style.backgroundImage = 'url(https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png)';

    var item = document.createElement('li');
    item.className = 'js-navigation-item';
    item.setAttribute('data-value', emojiName);
    item.setAttribute('data-text', '+1 thumbsup approve ok');

    item.insertBefore(icon);
    item.insertBefore(document.createTextNode(emojiName));

    return item;
  }
})();
