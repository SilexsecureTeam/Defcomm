const audioController = {
  audio: null as HTMLAudioElement | null,
  timeoutId: null as ReturnType<typeof setTimeout> | null,
  isPlaying: false,
  muted: false,

  playRingtone(ringtone: string, repeatFor30s: boolean = false) {
    // Reuse existing audio if possible
    if (!this.audio) {
      this.audio = new Audio(ringtone);
    } else if (this.audio.src !== ringtone) {
      this.audio.src = ringtone;
    }

    this.audio.loop = repeatFor30s;
    this.audio.volume = this.muted ? 0 : 1;

    const startPlay = () => {
      const playPromise = this.audio!.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Ringtone play interrupted:", error);
        });
      }
      this.isPlaying = true;
    };

    // Stop previous audio if still playing
    if (this.isPlaying) {
      this.stopRingtone();
      // Add tiny delay to prevent AbortError
      setTimeout(startPlay, 20);
    } else {
      startPlay();
    }

    if (repeatFor30s) {
      if (this.timeoutId) clearTimeout(this.timeoutId);
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
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.isPlaying = false;
  },

  setMuted(value: boolean) {
    this.muted = value;
    if (this.audio) {
      this.audio.volume = this.muted ? 0 : 1;
    }
  },

  toggleMute() {
    this.setMuted(!this.muted);
  },
};

export default audioController;
