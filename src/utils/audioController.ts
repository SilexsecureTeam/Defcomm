const audioController = {
  audio: null as HTMLAudioElement | null,
  timeoutId: null as ReturnType<typeof setTimeout> | null,

  playRingtone(ringtone: string, repeatFor30s: boolean) {
    this.stopRingtone(); // Ensure any previous audio is cleared

    this.audio = new Audio(ringtone);
    this.audio.loop = true;
    this.audio.play();

    // Auto-stop after 30 seconds
    if (repeatFor30s) {
      this.timeoutId = setTimeout(() => {
        this.stopRingtone();
      }, 30000); // 30 seconds
    }
  },

  stopRingtone() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  },
};

export default audioController;
