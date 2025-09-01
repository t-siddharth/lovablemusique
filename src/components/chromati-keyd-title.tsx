import { getNoteColorParts, CHROMATIC_NOTES } from '@/lib/music';
import type { ChromaticNote } from '@/types/music';

export const ChromatiKeydTitle = () => {
  // Map each letter to a chromatic note (12 letters, 12 notes)
  const letters = 'chromatikeyd'.split('');
  
  return (
    <h1 className="text-4xl font-bold mb-2">
      {letters.map((letter, index) => {
        const note = CHROMATIC_NOTES[index] as ChromaticNote;
        const { text } = getNoteColorParts(note);
        // Convert bg color to text color (e.g., bg-red-500 -> text-red-500)
        const textColor = text.replace('text-white', 'text-red-500')
          .replace('text-black', 'text-yellow-500');
        
        // Map note to appropriate text color
        const noteTextColors: Record<ChromaticNote, string> = {
          'C': 'text-red-500',
          'C#': 'text-orange-500',
          'D': 'text-yellow-500',
          'D#': 'text-lime-500',
          'E': 'text-green-500',
          'F': 'text-teal-500',
          'F#': 'text-cyan-500',
          'G': 'text-blue-500',
          'G#': 'text-indigo-500',
          'A': 'text-violet-500',
          'A#': 'text-fuchsia-500',
          'B': 'text-pink-500',
        };
        
        return (
          <span key={index} className={noteTextColors[note]}>
            {letter}
          </span>
        );
      })}
    </h1>
  );
};