import type { ChromaticNote } from '@/types/music';
import { CHROMATIC_COLORS } from '@/constants/colors';

/**
 * Array of all chromatic notes in order.
 * Used for transposition calculations and iteration.
 */
export const CHROMATIC_NOTES: ChromaticNote[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Returns the Tailwind CSS color classes for a given chromatic note.
 * 
 * @param note - The chromatic note to get colors for
 * @returns String containing background, hover, and text color classes
 * 
 * @example
 * ```tsx
 * const colorClasses = getNoteColor('C'); // 'bg-red-500 hover:bg-red-600 text-white'
 * <Button className={cn("base-styles", getNoteColor('C'))}>C</Button>
 * ```
 */
export const getNoteColor = (note: ChromaticNote): string => CHROMATIC_COLORS[note];

/**
 * Parses note color classes into separate components.
 * Useful when you need individual color parts instead of the full string.
 * 
 * @param note - The chromatic note to get color parts for
 * @returns Object with separate background, hover, and text color classes
 * 
 * @example
 * ```tsx
 * const { bg, hover, text } = getNoteColorParts('C');
 * // { bg: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-white' }
 * ```
 */
export const getNoteColorParts = (note: ChromaticNote): { bg: string; hover: string; text: string } => {
  const colorString = CHROMATIC_COLORS[note];
  const parts = colorString.split(' ');
  
  return {
    bg: parts.find(p => p.startsWith('bg-') && !p.includes('hover')) || '',
    hover: parts.find(p => p.includes('hover:bg-')) || '',
    text: parts.find(p => p.startsWith('text-')) || ''
  };
};

/**
 * Returns octave-specific color classes for a given chromatic note.
 * Different octaves use different color intensities:
 * - Octave 3: lighter intensity (300/400) with black text
 * - Octave 4: standard intensity (500/600) - current mapping
 * - Octave 5: darker intensity (700/800) with white text
 * 
 * @param note - The chromatic note to get colors for
 * @param octave - The octave number (3, 4, or 5)
 * @returns String containing background, hover, and text color classes
 * 
 * @example
 * ```tsx
 * const c3Color = getNoteColorForOctave('C', 3); // 'bg-red-300 hover:bg-red-400 text-black'
 * const c4Color = getNoteColorForOctave('C', 4); // 'bg-red-500 hover:bg-red-600 text-white'
 * const c5Color = getNoteColorForOctave('C', 5); // 'bg-red-700 hover:bg-red-800 text-white'
 * ```
 */
export const getNoteColorForOctave = (note: ChromaticNote, octave: number): string => {
  // Get the base color name from the default mapping
  const defaultColor = CHROMATIC_COLORS[note];
  const baseColorMatch = defaultColor.match(/bg-(\w+)-500/);
  const baseColor = baseColorMatch ? baseColorMatch[1] : 'gray';
  
  switch (octave) {
    case 3:
      return `bg-${baseColor}-300 hover:bg-${baseColor}-400 text-black`;
    case 4:
      return CHROMATIC_COLORS[note]; // Use current mapping
    case 5:
      return `bg-${baseColor}-700 hover:bg-${baseColor}-800 text-white`;
    default:
      return CHROMATIC_COLORS[note]; // Fallback to default
  }
};

/**
 * Transposes a scale to a new root note.
 * 
 * @param baseScale - Array of chromatic notes representing the scale pattern
 * @param rootNote - The new root note to transpose to
 * @returns New array of chromatic notes transposed to the specified root
 * 
 * @example
 * ```tsx
 * const cMajor = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
 * const dMajor = transposeScale(cMajor, 'D'); // ['D', 'E', 'F#', 'G', 'A', 'B', 'C#']
 * ```
 */
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

/**
 * Predefined musical scales as chromatic note arrays.
 * All scales are defined in C major/chromatic and can be transposed using transposeScale().
 * 
 * @example
 * ```tsx
 * const currentNotes = transposeScale(SCALES.pentatonic, 'G');
 * // Transposes pentatonic scale to G: ['G', 'A', 'B', 'D', 'E']
 * ```
 */
export const SCALES = {
  triad: ['C', 'E', 'G'] as ChromaticNote[],
  pentatonic: ['C', 'D', 'E', 'G', 'A'] as ChromaticNote[],
  major: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as ChromaticNote[],
  chromatic: CHROMATIC_NOTES
};