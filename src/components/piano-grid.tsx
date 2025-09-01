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
  
  // Sort active notes by chromatic order for consistent positioning
  const sortedActiveNotes = [...activeNotes].sort((a, b) => 
    CHROMATIC_NOTES.indexOf(a) - CHROMATIC_NOTES.indexOf(b)
  );
  
  // Calculate segment width for active notes
  const segmentWidth = activeCount > 0 ? 100 / activeCount : 100;

  // Calculate dot positions - dots appear where their segments would be
  const getInactiveNotePosition = (note: ChromaticNote) => {
    // Find where this note would be inserted in the sorted active notes
    const insertIndex = sortedActiveNotes.findIndex(activeNote => 
      CHROMATIC_NOTES.indexOf(activeNote) > CHROMATIC_NOTES.indexOf(note)
    );
    const finalIndex = insertIndex === -1 ? sortedActiveNotes.length : insertIndex;
    
    // Position at the center of where this segment would be
    const segmentCenter = (finalIndex / activeCount) * 100 + (segmentWidth / 2);
    return segmentCenter;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-1">
      {/* Compact dot overlay positioned above gaps */}
      <div className="relative h-4">
        {CHROMATIC_NOTES.map((note) => {
          const active = isActive(note);
          if (active) return null;
          
          const noteColor = getNoteColor(note);
          const bgColorClass = noteColor.split(' ')[0];
          const leftPosition = activeCount > 0 ? getInactiveNotePosition(note) : 50;
          
          return (
            <div
              key={`dot-${note}`}
              className={cn(
                "absolute rounded-full transition-all duration-300 ease-in-out transform -translate-x-1/2",
                "scale-100 opacity-100",
                bgColorClass
              )}
              style={{
                left: `${leftPosition}%`,
                width: '8px',
                height: '8px',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)'
              }}
            />
          );
        })}
      </div>

      {/* Active notes grid - chromatic layout */}
      <div className="relative h-32">
        {sortedActiveNotes.map((note, index) => {
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