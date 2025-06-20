const audioController = {
  audio: null as HTMLAudioElement | null,
  timeoutId: null as ReturnType<typeof setTimeout> | null,
  isPlaying: false,

  playRingtone(ringtone: string, repeatFor30s: boolean = true) {
    // Prevent duplicate play
    if (this.isPlaying) return;

    this.stopRingtone(); // Clear any existing state

    this.audio = new Audio(ringtone);
    this.audio.loop = true;

    // Mark it as playing early to avoid re-entry
    this.isPlaying = true;

    // Start playing with safe .play()
    const playPromise = this.audio.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn("Ringtone play interrupted:", error);
        this.isPlaying = false;
      });
    }

    // Stop after 30 seconds
    if (repeatFor30s) {
      this.timeoutId = setTimeout(() => {
        this.stopRingtone();
      }, 30000);
    }
  },

  stopRingtone() {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch (e) {
        console.warn("Error stopping audio:", e);
      }
      this.audio = null;
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.isPlaying = false;
  },
};

export default audioController;
