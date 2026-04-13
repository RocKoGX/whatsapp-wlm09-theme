(function () {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('content/sound-modifier.js');
  s.setAttribute('data-sound-url', chrome.runtime.getURL('assets/sounds/msn_message_sound.mp3'));
  s.onload = function () { this.remove(); };
  (document.head || document.documentElement).appendChild(s);
})();