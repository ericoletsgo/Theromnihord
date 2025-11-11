class AudioManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private preloadPromises: Promise<void>[] = [];
  private currentlyPlaying: HTMLAudioElement | null = null;

  preloadAudio(filePath: string): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = "auto";
      
      audio.addEventListener("canplaythrough", () => {
        this.audioCache.set(filePath, audio);
        console.log("Preloaded:", filePath);
        resolve();
      });

      audio.addEventListener("error", (e) => {
        console.warn("Omnichord audio missing for path:", filePath, e);
        // Don't cache failed loads, but resolve to not block other preloads
        resolve();
      });

      audio.addEventListener("loadeddata", () => {
        console.log("Audio data loaded:", filePath);
      });

      audio.src = filePath;
    });
  }

  preloadAll(filePaths: string[]): Promise<void[]> {
    this.preloadPromises = filePaths.map((path) => this.preloadAudio(path));
    return Promise.all(this.preloadPromises);
  }

  play(filePath: string): void {
    console.log("Attempting to play:", filePath);
    // Stop currently playing chord
    this.stopCurrent();

    const audio = this.audioCache.get(filePath);
    if (audio) {
      console.log("Using cached audio for:", filePath);
      // Use the cached audio directly, reset and play
      audio.currentTime = 0;
      audio.volume = 0.7;
      audio.loop = true;
      this.currentlyPlaying = audio;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Playing audio:", filePath);
          })
          .catch((err) => {
            console.error("Failed to play audio:", filePath, err);
            this.currentlyPlaying = null;
          });
      }
    } else {
      console.log("Audio not in cache, loading on-the-fly:", filePath);
      // Try to load on-the-fly if not in cache
      const audio = new Audio(filePath);
      audio.volume = 0.7;
      audio.loop = true;
      this.currentlyPlaying = audio;
      
      audio.addEventListener("error", (e) => {
        console.error("Audio load error for path:", filePath, e);
        console.error("Audio error details:", audio.error);
        this.currentlyPlaying = null;
      });
      
      audio.addEventListener("loadeddata", () => {
        console.log("Audio loaded successfully:", filePath);
      });
      
      audio.addEventListener("canplay", () => {
        console.log("Audio can play:", filePath);
      });
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Playing audio (on-the-fly):", filePath);
          })
          .catch((err) => {
            console.error("Failed to play audio (on-the-fly):", filePath, err);
            this.currentlyPlaying = null;
          });
      }
    }
  }

  stopCurrent(): void {
    if (this.currentlyPlaying) {
      this.currentlyPlaying.pause();
      this.currentlyPlaying.currentTime = 0;
      this.currentlyPlaying = null;
    }
  }

  isLoaded(filePath: string): boolean {
    return this.audioCache.has(filePath);
  }
}

export const audioManager = new AudioManager();
