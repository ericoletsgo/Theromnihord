export interface ChordMapping {
  key: string;
  chordName: string;
  filePath: string;
  row: "major" | "minor" | "7th";
}

export const chordMap: ChordMapping[] = [
  // Major chords (Q-O)
  { key: "q", chordName: "Eb MAJ", filePath: "/audio/eb-major.wav", row: "major" },
  { key: "w", chordName: "Bb MAJ", filePath: "/audio/bb-major.wav", row: "major" },
  { key: "e", chordName: "F MAJ", filePath: "/audio/f-major.wav", row: "major" },
  { key: "r", chordName: "C MAJ", filePath: "/audio/c-major.wav", row: "major" },
  { key: "t", chordName: "G MAJ", filePath: "/audio/g-major.wav", row: "major" },
  { key: "y", chordName: "D MAJ", filePath: "/audio/d-major.wav", row: "major" },
  { key: "u", chordName: "A MAJ", filePath: "/audio/a-major.wav", row: "major" },
  { key: "i", chordName: "E MAJ", filePath: "/audio/e-major.wav", row: "major" },
  { key: "o", chordName: "B MAJ", filePath: "/audio/b-major.wav", row: "major" },
  
  // Minor chords (A-L)
  { key: "a", chordName: "Eb MIN", filePath: "/audio/eb-minor.wav", row: "minor" },
  { key: "s", chordName: "Bb MIN", filePath: "/audio/bb-minor.wav", row: "minor" },
  { key: "d", chordName: "F MIN", filePath: "/audio/f-minor.wav", row: "minor" },
  { key: "f", chordName: "C MIN", filePath: "/audio/c-minor.wav", row: "minor" },
  { key: "g", chordName: "G MIN", filePath: "/audio/g-minor.wav", row: "minor" },
  { key: "h", chordName: "D MIN", filePath: "/audio/d-minor.wav", row: "minor" },
  { key: "j", chordName: "A MIN", filePath: "/audio/a-minor.wav", row: "minor" },
  { key: "k", chordName: "E MIN", filePath: "/audio/e-minor.wav", row: "minor" },
  { key: "l", chordName: "B MIN", filePath: "/audio/b-minor.wav", row: "minor" },
  
  // 7th chords (Z-.)
  { key: "z", chordName: "Eb 7TH", filePath: "/audio/eb-7th.wav", row: "7th" },
  { key: "x", chordName: "Bb 7TH", filePath: "/audio/bb-7th.wav", row: "7th" },
  { key: "c", chordName: "F 7TH", filePath: "/audio/f-7th.wav", row: "7th" },
  { key: "v", chordName: "C 7TH", filePath: "/audio/c-7th.wav", row: "7th" },
  { key: "b", chordName: "G 7TH", filePath: "/audio/g-7th.wav", row: "7th" },
  { key: "n", chordName: "D 7TH", filePath: "/audio/d-7th.wav", row: "7th" },
  { key: "m", chordName: "A 7TH", filePath: "/audio/a-7th.wav", row: "7th" },
  { key: ",", chordName: "E 7TH", filePath: "/audio/e-7th.wav", row: "7th" },
  { key: ".", chordName: "B 7TH", filePath: "/audio/b-7th.wav", row: "7th" },
];
