import { useEffect, useState } from "react";
import { ChordButton } from "./ChordButton";
import { TouchBar } from "./TouchBar";
import { chordMap, ChordMapping } from "@/data/chordMap";
import { audioManager } from "@/utils/audioManager";

export const ChordGrid = () => {
  const [activeChord, setActiveChord] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const playChord = (chord: ChordMapping) => {
    // Stop any currently playing chord and start the new one
    // Only one chord plays at a time
    audioManager.play(chord.filePath);
    setActiveChord(chord.key);
  };

  useEffect(() => {
    // Preload all audio files
    const filePaths = chordMap.map((chord) => chord.filePath);
    audioManager.preloadAll(filePaths).then(() => {
      console.log("Audio files preloaded");
      setIsLoading(false);
    });
  }, []);

  const stopChord = () => {
    audioManager.stopCurrent();
    setActiveChord(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle pause/stop key (Space bar)
      if (e.key === " " || e.key === "Space") {
        e.preventDefault();
        stopChord();
        return;
      }

      // Handle comma and period keys specifically
      let key = e.key.toLowerCase();
      if (e.key === ",") key = ",";
      if (e.key === ".") key = ".";
      
      const chord = chordMap.find((c) => c.key === key);
      
      if (chord) {
        e.preventDefault();
        // Play chord (will stop any currently playing chord and update visual state)
        playChord(chord);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const majorChords = chordMap.filter((c) => c.row === "major");
  const minorChords = chordMap.filter((c) => c.row === "minor");
  const seventhChords = chordMap.filter((c) => c.row === "7th");

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
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
                onPress={() => {
                  playChord(chord);
                }}
                onRelease={() => {
                  // Don't stop on release - chord keeps playing until another is pressed
                }}
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
                onPress={() => {
                  playChord(chord);
                }}
                onRelease={() => {
                  // Don't stop on release - chord keeps playing until another is pressed
                }}
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
                onPress={() => {
                  playChord(chord);
                }}
                onRelease={() => {
                  // Don't stop on release - chord keeps playing until another is pressed
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pause/Stop Button */}
      {activeChord && (
        <div className="flex justify-center mt-4">
          <button
            onClick={stopChord}
            className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-semibold hover:bg-destructive/90 transition-colors shadow-md"
          >
            Stop (Space)
          </button>
        </div>
      )}

      {/* Touch Bar (Scale Keys) */}
      <div className="mt-8">
        <TouchBar activeChord={activeChord} />
      </div>

      {/* Instructions */}
      <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
        <p className="font-semibold mb-2">How to play:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Click buttons or use keyboard shortcuts</li>
          <li>Major: Q W E R T Y U I O</li>
          <li>Minor: A S D F G H J K L</li>
          <li>7th: Z X C V B N M , .</li>
          <li>Scale keys: 1 2 3 4 5 6 7 8 9 0 - = (after selecting a chord)</li>
          <li>Pause/Stop: Space bar</li>
        </ul>
      </div>
    </div>
  );
};
