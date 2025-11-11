import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { chordMap } from "@/data/chordMap";

interface TouchBarProps {
  activeChord: string | null;
}

// Map chord names to their folder names for scale keys
const chordToFolder: Record<string, string> = {
  "Eb MAJ": "eb",
  "Bb MAJ": "bb",
  "F MAJ": "f",
  "C MAJ": "c",
  "G MAJ": "g",
  "D MAJ": "d",
  "A MAJ": "a",
  "E MAJ": "e",
  "B MAJ": "b",
  "Eb MIN": "ebm",
  "Bb MIN": "bbm",
  "F MIN": "fm",
  "C MIN": "cm",
  "G MIN": "gm",
  "D MIN": "dm",
  "A MIN": "am",
  "E MIN": "em",
  "B MIN": "bm",
  "Eb 7TH": "eb7",
  "Bb 7TH": "bb7",
  "F 7TH": "f7",
  "C 7TH": "c7",
  "G 7TH": "g7",
  "D 7TH": "d7",
  "A 7TH": "a7",
  "E 7TH": "e7",
  "B 7TH": "b7",
};

export const TouchBar = ({ activeChord }: TouchBarProps) => {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [chordName, setChordName] = useState<string | null>(null);

  // Get chord name from activeChord key
  useEffect(() => {
    if (activeChord) {
      const chord = chordMap.find((c) => c.key === activeChord);
      if (chord) {
        setChordName(chord.chordName);
      } else {
        setChordName(null);
      }
    } else {
      setChordName(null);
    }
  }, [activeChord]);

  // Map scale keys to keyboard: 1234567890-=
  // Scale indices: 0-11 map to keys: 1 2 3 4 5 6 7 8 9 0 - =
  const scaleKeyMap: Record<string, number> = {
    "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5,
    "7": 6, "8": 7, "9": 8, "0": 9, "-": 10, "=": 11,
  };

  const playNote = (noteIndex: number) => {
    if (!chordName) return;

    const folder = chordToFolder[chordName];
    if (!folder) {
      console.warn("No folder mapping for chord:", chordName);
      return;
    }

    const filePath = `/Omnichord/${folder}/${folder}${noteIndex}.wav`;
    console.log("Playing scale note:", filePath);
    
    // Play the note (non-looping, one-shot)
    const audio = new Audio(filePath);
    audio.volume = 0.7;
    audio.play().catch((err) => {
      console.error("Failed to play scale note:", filePath, err);
    });

    // Visual feedback - highlight on press
    setActiveNotes(prev => new Set(prev).add(noteIndex));
  };

  const stopNote = (noteIndex: number) => {
    // Remove visual feedback on release
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(noteIndex);
      return next;
    });
  };

  // Handle keyboard input for scale keys
  useEffect(() => {
    if (!chordName) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const noteIndex = scaleKeyMap[key];
      
      if (noteIndex !== undefined) {
        e.preventDefault();
        // Play note directly here to avoid dependency issues
        const folder = chordToFolder[chordName];
        if (!folder) return;

        const filePath = `/Omnichord/${folder}/${folder}${noteIndex}.wav`;
        const audio = new Audio(filePath);
        audio.volume = 0.7;
        audio.play().catch((err) => {
          console.error("Failed to play scale note:", filePath, err);
        });

        // Visual feedback - highlight on key down
        setActiveNotes(prev => new Set(prev).add(noteIndex));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key;
      const noteIndex = scaleKeyMap[key];
      
      if (noteIndex !== undefined) {
        e.preventDefault();
        // Remove visual feedback on key up
        setActiveNotes(prev => {
          const next = new Set(prev);
          next.delete(noteIndex);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [chordName]);

  // 12 scale keys (0-11) mapped to 1234567890-=
  const scaleKeys = Array.from({ length: 12 }, (_, i) => i);
  const keyLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="];

  if (!chordName) {
    return (
      <div className="w-full bg-muted/50 p-4 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground text-center">
          Select a chord to enable scale keys
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div className="text-sm font-semibold text-center text-muted-foreground">
        Scale Keys ({chordName})
      </div>
      <div className="flex gap-1 w-full">
        {scaleKeys.map((index) => (
          <button
            key={index}
            onMouseDown={() => playNote(index)}
            onMouseUp={() => stopNote(index)}
            onMouseLeave={() => stopNote(index)}
            className={cn(
              "flex-1 h-16 rounded border-2 transition-all duration-150",
              "hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              "flex flex-col items-center justify-center",
              activeNotes.has(index)
                ? "bg-primary border-primary shadow-lg"
                : "bg-yellow-200 border-yellow-300 hover:border-primary/50"
            )}
            title={`Note ${index} (Key: ${keyLabels[index]})`}
          >
            <span className="text-xs font-bold text-foreground/70">{keyLabels[index]}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground">
        Click scale keys or press 1-9, 0, -, = to play multiple notes simultaneously
      </p>
    </div>
  );
};

