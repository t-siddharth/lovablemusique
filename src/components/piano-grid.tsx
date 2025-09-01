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

export const PianoGrid = ({ activeNotes, octave, onPlay, onRelease, isInitialized }: PianoGridProps) => {
  const isActive = (note: ChromaticNote) => activeNotes.includes(note);
  const activeCount = activeNotes.length;
  
  // Calculate segment width for active notes
  const segmentWidth = activeCount > 0 ? 100 / activeCount : 100;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Compact dot rail for all notes */}
      <div className="flex justify-center items-center gap-2 px-8 py-2">
        {CHROMATIC_NOTES.map((note) => {
          const active = isActive(note);
          const noteColor = getNoteColor(note);
          const bgColorClass = noteColor.split(' ')[0]; // Extract just the bg-color-xxx part
          
          return (
            <div
              key={`dot-${note}`}
              className={cn(
                "rounded-full transition-all duration-300 ease-in-out",
                active ? "scale-0 opacity-0" : "scale-100 opacity-100",
                bgColorClass
              )}
              style={{
                width: active ? '0px' : '8px',
                height: active ? '0px' : '8px',
              }}
            />
          );
        })}
      </div>

      {/* Active notes grid - chromatic layout */}
      <div className="relative h-32">
        {activeNotes.map((note, index) => {
          const leftPosition = (index / activeCount) * 100;
          
          return (
            <div
              key={`active-${note}`}
              className="absolute transition-all duration-300 ease-in-out"
              style={{
                left: `${leftPosition}%`,
                width: `${segmentWidth}%`,
                height: '100%'
              }}
            >
              <div className="p-1 h-full">
                <NoteButton
                  note={note}
                  octave={octave}
                  onPlay={onPlay}
                  onRelease={() => onRelease(`${note}${octave}`)}
                  disabled={!isInitialized}
                  isActive={true}
                  className="w-full h-full text-lg font-bold"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};