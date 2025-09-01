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

  // Group inactive notes by their insertion gap and calculate positions
  const inactiveNotes = CHROMATIC_NOTES.filter(note => !isActive(note));
  
  const getInactiveNotePositions = () => {
    if (activeCount === 0) {
      // Special case: no active notes, distribute dots evenly
      return inactiveNotes.map((note, index) => ({
        note,
        left: (index / (inactiveNotes.length - 1)) * 100
      }));
    }

    // Group inactive notes by their insertion gap
    const notesByGap = new Map<number, ChromaticNote[]>();
    
    inactiveNotes.forEach(note => {
      const insertIndex = sortedActiveNotes.findIndex(activeNote => 
        CHROMATIC_NOTES.indexOf(activeNote) > CHROMATIC_NOTES.indexOf(note)
      );
      const gapIndex = insertIndex === -1 ? sortedActiveNotes.length : insertIndex;
      
      if (!notesByGap.has(gapIndex)) {
        notesByGap.set(gapIndex, []);
      }
      notesByGap.get(gapIndex)!.push(note);
    });

    // Calculate positions for each gap
    const positions: { note: ChromaticNote; left: number }[] = [];
    
    notesByGap.forEach((notesInGap, gapIndex) => {
      // Position at the gap boundary (left edge of the segment)
      const gapPosition = (gapIndex / activeCount) * 100;
      
      // If multiple notes in this gap, spread them slightly around the gap
      if (notesInGap.length === 1) {
        positions.push({ note: notesInGap[0], left: gapPosition });
      } else {
        // Bunch them up with small offsets (±2% max spread)
        const maxSpread = Math.min(2, segmentWidth * 0.3);
        const step = maxSpread * 2 / (notesInGap.length - 1);
        
        notesInGap.forEach((note, index) => {
          const offset = -maxSpread + (step * index);
          positions.push({ 
            note, 
            left: Math.max(0, Math.min(100, gapPosition + offset))
          });
        });
      }
    });

    return positions;
  };

  const inactivePositions = getInactiveNotePositions();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-1">
      {/* Compact dot overlay positioned above gaps */}
      <div className="relative h-4">
        {inactivePositions.map(({ note, left }) => {
          const noteColor = getNoteColor(note);
          const bgColorClass = noteColor.split(' ')[0];
          
          return (
            <div
              key={`dot-${note}`}
              className={cn(
                "absolute rounded-full transition-all duration-300 ease-in-out transform -translate-x-1/2",
                "scale-100 opacity-100",
                bgColorClass
              )}
              style={{
                left: `${left}%`,
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