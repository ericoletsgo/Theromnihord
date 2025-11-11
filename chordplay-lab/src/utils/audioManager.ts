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
        resolve();
      });

      audio.addEventListener("error", (e) => {
        console.error(`Failed to load audio: ${filePath}`, e);
        resolve(); // Resolve anyway to not block other preloads
      });

      audio.src = filePath;
    });
  }

  preloadAll(filePaths: string[]): Promise<void[]> {
    this.preloadPromises = filePaths.map((path) => this.preloadAudio(path));
    return Promise.all(this.preloadPromises);
  }

  play(filePath: string): void {
    // Stop currently playing chord
    this.stopCurrent();

    const audio = this.audioCache.get(filePath);
    if (audio) {
      // Clone and play
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = 0.7;
      clone.loop = true; // Loop the chord while held
      this.currentlyPlaying = clone;
      
      clone.play().catch((err) => {
        console.warn(`Failed to play audio: ${filePath}`, err);
      });
    } else {
      console.warn(`Audio not found in cache: ${filePath}`);
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
