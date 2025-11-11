import { useEffect, useState } from "react";
import { ChordButton } from "./ChordButton";
import { chordMap, ChordMapping } from "@/data/chordMap";
import { audioManager } from "@/utils/audioManager";

export const ChordGrid = () => {
  const [activeChord, setActiveChord] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload all audio files
    const filePaths = chordMap.map((chord) => chord.filePath);
    audioManager.preloadAll(filePaths).then(() => {
      console.log("Audio files preloaded");
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const chord = chordMap.find((c) => c.key === key);
      
      if (chord && activeChord !== key) {
        e.preventDefault();
        playChord(chord);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (activeChord === key) {
        releaseChord();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeChord]);

  const playChord = (chord: ChordMapping) => {
    audioManager.play(chord.filePath);
    setActiveChord(chord.key);
  };

  const releaseChord = () => {
    audioManager.stopCurrent();
    setActiveChord(null);
  };

  const majorChords = chordMap.filter((c) => c.row === "major");
  const minorChords = chordMap.filter((c) => c.row === "minor");
  const seventhChords = chordMap.filter((c) => c.row === "7th");

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Data Display */}
      <details className="bg-card p-4 rounded-lg border border-border">
        <summary className="cursor-pointer font-semibold text-foreground mb-2">
          Chord Mapping Data (click to expand)
        </summary>
        <pre className="text-xs overflow-auto bg-muted p-3 rounded">
          {JSON.stringify(chordMap, null, 2)}
        </pre>
      </details>

      {isLoading && (
        <div className="text-center text-muted-foreground">Loading audio files...</div>
      )}

      {/* Chord Grid */}
      <div className="space-y-4">
        {/* Major Row */}
        <div>
          <div className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">
            Major Chords
          </div>
          <div className="grid grid-cols-9 gap-2">
            {majorChords.map((chord) => (
              <ChordButton
                key={chord.key}
                chordName={chord.chordName}
                keyLabel={chord.key}
                isActive={activeChord === chord.key}
                onPress={() => playChord(chord)}
                onRelease={() => releaseChord()}
              />
            ))}
          </div>
        </div>

        {/* Minor Row */}
        <div>
          <div className="text-sm font-bold text-secondary mb-2 uppercase tracking-wide">
            Minor Chords
          </div>
          <div className="grid grid-cols-9 gap-2">
            {minorChords.map((chord) => (
              <ChordButton
                key={chord.key}
                chordName={chord.chordName}
                keyLabel={chord.key}
                isActive={activeChord === chord.key}
                onPress={() => playChord(chord)}
                onRelease={() => releaseChord()}
              />
            ))}
          </div>
        </div>

        {/* 7th Row */}
        <div>
          <div className="text-sm font-bold text-accent mb-2 uppercase tracking-wide">
            7th Chords
          </div>
          <div className="grid grid-cols-9 gap-2">
            {seventhChords.map((chord) => (
              <ChordButton
                key={chord.key}
                chordName={chord.chordName}
                keyLabel={chord.key}
                isActive={activeChord === chord.key}
                onPress={() => playChord(chord)}
                onRelease={() => releaseChord()}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
        <p className="font-semibold mb-2">How to play:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Click buttons or use keyboard shortcuts</li>
          <li>Major: Q W E R T Y U I O</li>
          <li>Minor: A S D F G H J K L</li>
          <li>7th: Z X C V B N M , .</li>
        </ul>
      </div>
    </div>
  );
};
