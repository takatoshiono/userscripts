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

  var ime = false;

  console.log("hello, this is suggest-emoji");

  window.onload = function() {
    document.addEventListener('keydown', function(evt) {
      // IME が on のときは keydown が 229 になる
      if (evt.keyCode == 229) {
        ime = true;
      } else {
        ime = false;
      }
    }, false);

    textareas = document.getElementsByTagName('textarea');
    for (var i = 0; i < textareas.length; i++) {
      if (textareas[i].className.indexOf('js-suggester-field') !== -1) {
        textareas[i].addEventListener('keyup', suggest, false);
      }
    }
  };

  function suggest(evt) {
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
    var suggesterContainer = getChildNode(this.parentNode.parentNode, 'DIV', 'suggester-container');
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
      for (var i = 0; i < jsNavigationItems.length; i++) {
        emojiSuggestions.removeChild(jsNavigationItems[i]);
      }
    }

    // suggest したい li を作る
    navigationItem = createEmojiElement('+1');
    emojiSuggestions.insertBefore(navigationItem);
    console.log(navigationItem);

    // TODO:div.suggester-containerの top, left を設定する（カーソル位置と同じ？）
    // ググったら一発目でこれが出てきた
    // http://qiita.com/yuku_t/items/fb92e173120d7b2e49ed
    var caret = getCaret(this);
    suggester.style.top = caret.top.toString() + 'px';
    suggester.style.left = caret.left.toString() + 'px';
    console.log("top:" + caret.top + ", left:" + caret.left);

    suggester.className = suggester.className + ' active'

    // ul.suggestions を display:block にする
    emojiSuggestions.style.display = 'block';

    console.log(evt);
    inputKeyCodes.add(evt.keyCode);

    //// <img class="emoji" title=":100:" alt=":100:" src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f4af.png" height="20" width="20" align="absmiddle">
    //img = document.createElement('img');
    //img.class = 'emoji';
    //img.src = 'https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png';
    //img.height = 20;
    //img.width = 20;
    //img.align = 'absmiddle';
    //emojiArea = document.getElementById('emoji');
    //emojiArea.insertBefore(img);
  }

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

  // ref: http://qiita.com/yuku_t/items/fb92e173120d7b2e49ed
  function getCaret(textarea) {
    var start = textarea.selectionStart;
    console.log("start:" + start);

    // 先頭からカーソル位置までを取得する
    var text = textarea.value.substring(0, start);
    console.log("text:" + text);

    // textareaを模倣したdiv要素を用意する
    var div = document.getElementById('textarea-clone');
    if (!div) {
      div = document.createElement('div');
    }

    var list  = ['border-bottom-width', 'border-left-width', 'border-right-width',
                 'border-top-width', 'font-family', 'font-size', 'font-style',
                 'font-variant', 'font-weight', 'height', 'letter-spacing',
                 'word-spacing', 'line-height', 'padding-bottom', 'padding-left',
                 'padding-right', 'padding-top', 'text-decoration', 'width'];

    div.id = 'textarea-clone';

    // 画面外に配置する
    div.style.position = 'absolute';
    div.style.top      = 0;
    div.style.left     = '-9999px';

    // textareaのスタイルをコピーする
    for (var i = 0; i < list.length; i++) {
      div.style[list[i]] = textarea.style[list[i]];
    }

    // divを画面に挿入する
    document.body.appendChild(div);

    // カーソルまでの文字列とspanを末尾に入れてspanの位置を計算する

    var span = document.createElement('span');
    // spanに大きさをもたせるために適当な文字列を挿入
    span.innerHTML = '&nbsp;';

    // 文字列を挿入
    div.textContent = text;
    // スクロール位置を調整
    div.scrollTop = div.scrollHeight;
    // spanを挿入
    div.appendChild(span);

    // spanの位置を取得。簡単のためにjQueryを使っている
    //var position = $(span).position();
    //var position = document.getElementById('dummy-for-suggest').position();
    //var temp = document.getElementById('dummy-for-suggest');

    return {
      top: span.offsetTop,
      left: span.offsetLeft,
    };
  }
})();
