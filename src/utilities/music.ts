import type { ChromaticNote } from '@/types/music';
import { CHROMATIC_COLORS } from '@/constants/colors';

export const CHROMATIC_NOTES: ChromaticNote[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const getNoteColor = (note: ChromaticNote): string => CHROMATIC_COLORS[note];

export const transposeScale = (baseScale: ChromaticNote[], rootNote: ChromaticNote): ChromaticNote[] => {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);
  const baseRootIndex = CHROMATIC_NOTES.indexOf(baseScale[0]);
  const transposition = rootIndex - baseRootIndex;
  
  return baseScale.map(note => {
    const noteIndex = CHROMATIC_NOTES.indexOf(note);
    const newIndex = (noteIndex + transposition + 12) % 12;
    return CHROMATIC_NOTES[newIndex];
  });
};

export const SCALES = {
  triad: ['C', 'E', 'G'] as ChromaticNote[],
  pentatonic: ['C', 'D', 'E', 'G', 'A'] as ChromaticNote[],
  major: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as ChromaticNote[],
  chromatic: CHROMATIC_NOTES
};