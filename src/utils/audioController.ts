const audioController = {
    audio: null as HTMLAudioElement | null,

    playRingtone(ringtone: string) {
        if (!this.audio) {
            this.audio = new Audio(ringtone);
            this.audio.loop = true;
        }
        this.audio.play();
    },

    stopRingtone() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio = null;
        }
    }
};

export default audioController;
