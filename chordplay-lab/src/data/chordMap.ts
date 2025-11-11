export interface ChordMapping {
  key: string;
  chordName: string;
  filePath: string;
  row: "major" | "minor" | "7th";
}

/**
 * Chord mapping matching STM32 firmware chord order:
 * Eb, Bb, F, C, G, D, A, E, B
 * 
 * File paths use /Omnichord/... which assumes files are accessible from the public folder.
 * To set up:
 * - Option 1: Create a symlink: ln -s ../Omnichord public/Omnichord (Linux/Mac)
 *            or mklink /D public\Omnichord ..\Omnichord (Windows)
 * - Option 2: Copy the Omnichord folder to public/Omnichord
 * 
 * If using relative paths ../Omnichord/..., they won't work in browser - use /Omnichord/... instead.
 */
export const chordMap: ChordMapping[] = [
  // Major chords (Q-O): Eb, Bb, F, C, G, D, A, E, B
  // Note: eb and g don't have -chord.wav files, using eb0.wav and g0.wav as fallbacks
  { key: "q", chordName: "Eb MAJ", filePath: "/Omnichord/eb/eb0.wav", row: "major" },
  { key: "w", chordName: "Bb MAJ", filePath: "/Omnichord/bb/bb-chord.wav", row: "major" },
  { key: "e", chordName: "F MAJ", filePath: "/Omnichord/f/f-chord.wav", row: "major" },
  { key: "r", chordName: "C MAJ", filePath: "/Omnichord/c/c-chord.wav", row: "major" },
  { key: "t", chordName: "G MAJ", filePath: "/Omnichord/g/g0.wav", row: "major" },
  { key: "y", chordName: "D MAJ", filePath: "/Omnichord/d/d-chord.wav", row: "major" },
  { key: "u", chordName: "A MAJ", filePath: "/Omnichord/a/a-chord.wav", row: "major" },
  { key: "i", chordName: "E MAJ", filePath: "/Omnichord/e/e-chord.wav", row: "major" },
  { key: "o", chordName: "B MAJ", filePath: "/Omnichord/b/b-chord.wav", row: "major" },
  
  // Minor chords (A-L): Eb, Bb, F, C, G, D, A, E, B
  { key: "a", chordName: "Eb MIN", filePath: "/Omnichord/ebm/ebm-chord.wav", row: "minor" },
  { key: "s", chordName: "Bb MIN", filePath: "/Omnichord/bbm/bbm-chord.wav", row: "minor" },
  { key: "d", chordName: "F MIN", filePath: "/Omnichord/fm/fm-chord.wav", row: "minor" },
  { key: "f", chordName: "C MIN", filePath: "/Omnichord/cm/cm-chord.wav", row: "minor" },
  { key: "g", chordName: "G MIN", filePath: "/Omnichord/gm/gm-chord.wav", row: "minor" },
  { key: "h", chordName: "D MIN", filePath: "/Omnichord/dm/dm-chord.wav", row: "minor" },
  { key: "j", chordName: "A MIN", filePath: "/Omnichord/am/am-chord.wav", row: "minor" },
  { key: "k", chordName: "E MIN", filePath: "/Omnichord/em/em-chord.wav", row: "minor" },
  { key: "l", chordName: "B MIN", filePath: "/Omnichord/bm/bm-chord.wav", row: "minor" },
  
  // 7th chords (Z-.): Eb, Bb, F, C, G, D, A, E, B
  { key: "z", chordName: "Eb 7TH", filePath: "/Omnichord/eb7/eb7-chord.wav", row: "7th" },
  { key: "x", chordName: "Bb 7TH", filePath: "/Omnichord/bb7/bb7-chord.wav", row: "7th" },
  { key: "c", chordName: "F 7TH", filePath: "/Omnichord/f7/f7-chord.wav", row: "7th" },
  { key: "v", chordName: "C 7TH", filePath: "/Omnichord/c7/c7-chord.wav", row: "7th" },
  { key: "b", chordName: "G 7TH", filePath: "/Omnichord/g7/g7-chord.wav", row: "7th" },
  { key: "n", chordName: "D 7TH", filePath: "/Omnichord/d7/d7-chord.wav", row: "7th" },
  { key: "m", chordName: "A 7TH", filePath: "/Omnichord/a7/a7-chord.wav", row: "7th" },
  { key: ",", chordName: "E 7TH", filePath: "/Omnichord/e7/e7-chord.wav", row: "7th" },
  { key: ".", chordName: "B 7TH", filePath: "/Omnichord/b7/b7-chord.wav", row: "7th" },
];
