import type { ChromaticNote } from '@/types/music';

/**
 * Color mapping for chromatic notes using Tailwind CSS utility classes.
 * 
 * Each note is mapped to a unique color following the chromatic circle.
 * Format: 'background hover:background text-color'
 * 
 * Color assignments:
 * - C: Red (root/tonic)
 * - C#/Db: Orange 
 * - D: Yellow
 * - D#/Eb: Lime
 * - E: Green
 * - F: Teal
 * - F#/Gb: Cyan
 * - G: Blue (perfect fifth from C)
 * - G#/Ab: Indigo
 * - A: Violet (natural sixth)
 * - A#/Bb: Fuchsia
 * - B: Pink (leading tone)
 * 
 * @example
 * ```tsx
 * import { CHROMATIC_COLORS } from '@/constants/colors';
 * const cColor = CHROMATIC_COLORS['C']; // 'bg-red-500 hover:bg-red-600 text-white'
 * ```
 */
export const CHROMATIC_COLORS = {
  'C': 'bg-red-500 hover:bg-red-600 text-white',
  'C#': 'bg-orange-500 hover:bg-orange-600 text-white', 
  'D': 'bg-yellow-500 hover:bg-yellow-600 text-black',
  'D#': 'bg-lime-500 hover:bg-lime-600 text-black',
  'E': 'bg-green-500 hover:bg-green-600 text-white',
  'F': 'bg-teal-500 hover:bg-teal-600 text-white',
  'F#': 'bg-cyan-500 hover:bg-cyan-600 text-black',
  'G': 'bg-blue-500 hover:bg-blue-600 text-white',
  'G#': 'bg-indigo-500 hover:bg-indigo-600 text-white',
  'A': 'bg-violet-500 hover:bg-violet-600 text-white',
  'A#': 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white',
  'B': 'bg-pink-500 hover:bg-pink-600 text-black',
} as const;