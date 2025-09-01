import { CHROMATIC_NOTES, getNoteColor, type ChromaticNote } from '@/lib/music';
import { NoteButton } from './ui/note-button';
import { cn } from '@/lib/utils';

interface PianoGridProps {
  activeNotes: ChromaticNote[];
  octave: number;
  onPlay: (note: string, frequency: number) => void;
  onRelease: (noteString: string) => void;
  isInitialized: boolean;
}

// Piano layout mapping - which column each note appears in (1-14)
const PIANO_LAYOUT = {
  'C': 1,   'C#': 2,
  'D': 3,   'D#': 4,
  'E': 5,
  'F': 6,   'F#': 7,
  'G': 8,   'G#': 9,
  'A': 10,  'A#': 11,
  'B': 12
} as const;

// Natural (white) keys
const NATURAL_NOTES: ChromaticNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
// Sharp (black) keys
const SHARP_NOTES: ChromaticNote[] = ['C#', 'D#', 'F#', 'G#', 'A#'];

export const PianoGrid = ({ activeNotes, octave, onPlay, onRelease, isInitialized }: PianoGridProps) => {
  const isActive = (note: ChromaticNote) => activeNotes.includes(note);

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* 14-column grid container */}
      <div className="grid grid-cols-14 gap-1 relative">
        
        {/* Natural keys (white keys) - bottom layer */}
        {NATURAL_NOTES.map((note) => {
          const active = isActive(note);
          const column = PIANO_LAYOUT[note];
          
          return (
            <div
              key={`natural-${note}`}
              className={cn(
                "col-span-2",
                column === 1 && "col-start-1",
                column === 3 && "col-start-3", 
                column === 5 && "col-start-5",
                column === 6 && "col-start-6",
                column === 8 && "col-start-8",
                column === 10 && "col-start-10",
                column === 12 && "col-start-12"
              )}
            >
              <NoteButton
                note={note}
                octave={octave}
                onPlay={onPlay}
                onRelease={() => onRelease(`${note}${octave}`)}
                disabled={!isInitialized}
                isActive={active}
                variant="natural"
                className={cn(
                  "w-full transition-all duration-300",
                  active ? "h-32" : "h-4"
                )}
              />
            </div>
          );
        })}

        {/* Sharp keys (black keys) - top layer, positioned above naturals */}
        {SHARP_NOTES.map((note) => {
          const active = isActive(note);
          const column = PIANO_LAYOUT[note];
          
          return (
            <div
              key={`sharp-${note}`}
              className={cn(
                "absolute z-10 col-span-1",
                "transform -translate-x-1/2",
                column === 2 && "left-[12.5%]",   // Between C and D
                column === 4 && "left-[29.17%]",  // Between D and E  
                column === 7 && "left-[54.17%]",  // Between F and G
                column === 9 && "left-[70.83%]",  // Between G and A
                column === 11 && "left-[87.5%]"   // Between A and B
              )}
              style={{ top: '0' }}
            >
              <NoteButton
                note={note}
                octave={octave}
                onPlay={onPlay}
                onRelease={() => onRelease(`${note}${octave}`)}
                disabled={!isInitialized}
                isActive={active}
                variant="sharp"
                className={cn(
                  "w-12 transition-all duration-300",
                  active ? "h-20" : "h-3"
                )}
              />
            </div>
          );
        })}

        {/* Inactive notes as tiny dots */}
        {CHROMATIC_NOTES.filter(note => !isActive(note)).map((note) => {
          const isSharp = SHARP_NOTES.includes(note);
          const column = PIANO_LAYOUT[note];
          const noteColors = getNoteColor(note).split(' ');
          const bgClass = noteColors[0].replace('bg-', 'bg-');
          
          return (
            <div
              key={`dot-${note}`}
              className={cn(
                "absolute z-5 pointer-events-none",
                isSharp ? "top-16" : "top-28"
              )}
              style={{
                left: `${((column - 1) / 12) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div 
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  bgClass
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};