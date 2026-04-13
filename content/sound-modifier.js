(function () {
  const WHATSAPP_NOTIFICATION_URL = 'https://static.whatsapp.net/rsrc.php/yW/r/BS_BUUXbKq5.mp3';
  const MSN_SOUND_URL = document.currentScript.getAttribute('data-sound-url');

  const audioDefaultPlay = window.Audio.prototype.play;
  window.Audio.prototype.play = function () {
    if (this.src.startsWith(WHATSAPP_NOTIFICATION_URL)) {
      this.src = MSN_SOUND_URL;
    }
    return audioDefaultPlay.apply(this, arguments);
  };
})();