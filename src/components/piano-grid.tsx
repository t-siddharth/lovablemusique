import { CHROMATIC_NOTES, getNoteColor, getNoteColorForOctave, type ChromaticNote } from '@/lib/music';
import { NoteButton } from './ui/note-button';
import { cn } from '@/lib/utils';

interface PianoGridProps {
  activeNotes: ChromaticNote[];
  octave: number;
  octaveCount?: number;
  onPlay: (note: string, frequency: number) => void;
  onRelease: (noteString: string) => void;
  isInitialized: boolean;
}

export const PianoGrid = ({ activeNotes, octave, octaveCount = 1, onPlay, onRelease, isInitialized }: PianoGridProps) => {
  const isActive = (note: ChromaticNote) => activeNotes.includes(note);
  const activeCount = activeNotes.length;
  
  // Check if we're in chromatic mode (all 12 notes active)
  const isChromatic = activeCount === 12;
  
  // For non-chromatic scales, display notes in root-first order
  // For chromatic scale, maintain chromatic order
  const sortedActiveNotes = isChromatic 
    ? [...activeNotes].sort((a, b) => CHROMATIC_NOTES.indexOf(a) - CHROMATIC_NOTES.indexOf(b))
    : activeNotes; // Keep original order which starts with root note
  
  // Calculate segment width for active notes
  const segmentWidth = activeCount > 0 ? 100 / activeCount : 100;

  // Helper to determine if a note is sharp/flat
  const isSharpFlat = (note: ChromaticNote) => note.includes('#');
  
  // Separate natural and sharp/flat notes
  const inactiveNotes = CHROMATIC_NOTES.filter(note => !isActive(note));
  const inactiveNaturals = inactiveNotes.filter(note => !isSharpFlat(note));
  const inactiveSharpFlats = inactiveNotes.filter(note => isSharpFlat(note));
  
  
  // Natural notes for piano layout reference
  const naturalNotes: ChromaticNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  
  const getInactiveNotePositions = (notes: ChromaticNote[], isSharp = false) => {
    if (activeCount === 0) {
      // Special case: no active notes, distribute dots evenly
      return notes.map((note, index) => ({
        note,
        left: (index / Math.max(notes.length - 1, 1)) * 100,
        isSharp
      }));
    }

    // Group inactive notes by their insertion gap
    const notesByGap = new Map<number, ChromaticNote[]>();
    
    notes.forEach(note => {
      let insertIndex;
      if (isChromatic) {
        // For chromatic mode, use chromatic ordering
        insertIndex = sortedActiveNotes.findIndex(activeNote => 
          CHROMATIC_NOTES.indexOf(activeNote) > CHROMATIC_NOTES.indexOf(note)
        );
      } else {
        // For non-chromatic mode, use rotated chromatic circle anchored at root
        const rootNote = sortedActiveNotes[0];
        const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);
        
        // Create rotated chromatic circle starting from root
        const rotatedChromatic = [
          ...CHROMATIC_NOTES.slice(rootIndex),
          ...CHROMATIC_NOTES.slice(0, rootIndex)
        ];
        
        const notePositionInRotated = rotatedChromatic.indexOf(note);
        insertIndex = sortedActiveNotes.findIndex(activeNote => {
          const activePositionInRotated = rotatedChromatic.indexOf(activeNote);
          return activePositionInRotated > notePositionInRotated;
        });
      }
      
      const gapIndex = insertIndex === -1 ? sortedActiveNotes.length : insertIndex;
      
      if (!notesByGap.has(gapIndex)) {
        notesByGap.set(gapIndex, []);
      }
      notesByGap.get(gapIndex)!.push(note);
    });

    // Calculate positions for each gap with improved collision handling
    const positions: { note: ChromaticNote; left: number; isSharp: boolean }[] = [];
    const minSpacing = 1.5; // Minimum 1.5% spacing between dots
    
    notesByGap.forEach((notesInGap, gapIndex) => {
      // Position at the gap boundary
      const gapPosition = (gapIndex / activeCount) * 100;
      
      if (notesInGap.length === 1) {
        positions.push({ note: notesInGap[0], left: gapPosition, isSharp });
      } else {
        // Edge-aware spreading
        const maxSpread = Math.min(3, segmentWidth * 0.4);
        const totalWidth = (notesInGap.length - 1) * minSpacing;
        const actualSpread = Math.min(maxSpread, totalWidth);
        
        let baseOffset = -actualSpread / 2;
        
        // Adjust for edge gaps
        if (gapIndex === 0) {
          baseOffset = 0; // Right-side spread only
        } else if (gapIndex === activeCount) {
          baseOffset = -actualSpread; // Left-side spread only
        }
        
        notesInGap.forEach((note, index) => {
          const offset = baseOffset + (index * (actualSpread / Math.max(notesInGap.length - 1, 1)));
          const finalLeft = Math.max(0, Math.min(100, gapPosition + offset));
          
          // Add epsilon to prevent identical positions
          const epsilon = index * 0.01;
          positions.push({ 
            note, 
            left: finalLeft + epsilon,
            isSharp
          });
        });
      }
    });

    return positions;
  };

  // Get positions for natural and sharp/flat dots
  const naturalPositions = getInactiveNotePositions(inactiveNaturals, false);
  const sharpFlatPositions = getInactiveNotePositions(inactiveSharpFlats, true);
  const allInactivePositions = [...naturalPositions, ...sharpFlatPositions];

  // For chromatic view, separate active naturals and sharps/flats
  const activeNaturals = activeNotes.filter(note => !isSharpFlat(note));
  const activeSharpFlats = activeNotes.filter(note => isSharpFlat(note));

  // Multi-octave rendering
  if (octaveCount > 1) {
    const getRowHeight = () => {
      switch (octaveCount) {
        case 2: return 'h-32 md:h-40 lg:h-48';
        case 3: return 'h-28 md:h-32 lg:h-40';
        default: return 'h-40 md:h-48 lg:h-56';
      }
    };

    const rowHeight = getRowHeight();

    // Calculate octaves from top to bottom: [highest → lowest]
    const rowOctaves = (() => {
      switch (octaveCount) {
        case 1: return [octave];
        case 2: return [octave + 1, octave]; // C5 at top, C4 at bottom
        case 3: return [octave + 1, octave, octave - 1]; // C5, C4, C3
        default: return [octave];
      }
    })();

    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col gap-2">
          {rowOctaves.map((rowOctave) => {
            
            return (
              <div key={rowOctave} className="w-full">
                {isChromatic ? (
                  /* Chromatic layout for this row */
                  <div className="space-y-0">
                    {/* Sharp/flat keys row (top) */}
                    <div className="relative h-14 -mb-2 z-10">
                      {activeSharpFlats.map((note) => {
                        // Dynamic mapping based on actual natural key order
                        const leftOf: Partial<Record<ChromaticNote, ChromaticNote>> = {
                          'C#': 'D',
                          'D#': 'E',
                          'F#': 'G', 
                          'G#': 'A',
                          'A#': 'B'
                        };
                        
                        const rightNatural = leftOf[note as keyof typeof leftOf];
                        const naturalIndex = naturalNotes.indexOf(rightNatural);
                        const leftPosition = naturalIndex >= 0 
                          ? (naturalIndex / naturalNotes.length) * 100
                          : 0;
                        
                        return (
                          <div
                            key={`sharp-${note}-${rowOctave}`}
                            className="absolute transition-all duration-300 ease-in-out origin-bottom"
                            style={{
                              left: `${leftPosition}%`,
                              width: `${100 / (naturalNotes.length * 1.4)}%`,
                              height: '100%',
                              transform: 'translateX(-50%) translateY(-6px)'
                            }}
                          >
                            <div className="p-0.5 h-full">
                              <NoteButton
                                note={note}
                                octave={rowOctave}
                                onPlay={onPlay}
                                onRelease={() => onRelease(`${note}${rowOctave}`)}
                                disabled={!isInitialized}
                                isActive={true}
                                variant="sharp"
                                className="w-full h-full text-sm font-bold"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Natural keys row (bottom) */}
                    <div className={`relative ${rowHeight}`}>
                      {activeNaturals.map((note, index) => {
                        const leftPosition = (index / naturalNotes.length) * 100;
                        
                        return (
                          <div
                            key={`natural-${note}-${rowOctave}`}
                            className="absolute transition-all duration-300 ease-in-out"
                            style={{
                              left: `${leftPosition}%`,
                              width: `${100 / naturalNotes.length}%`,
                              height: '100%'
                            }}
                          >
                            <div className="p-1 h-full">
                              <NoteButton
                                note={note}
                                octave={rowOctave}
                                onPlay={onPlay}
                                onRelease={() => onRelease(`${note}${rowOctave}`)}
                                disabled={!isInitialized}
                                isActive={true}
                                variant="natural"
                                className="w-full h-full text-lg font-bold"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Single row layout for non-chromatic views */
                  <div className={`relative ${rowHeight}`}>
                    {sortedActiveNotes.map((note, index) => {
                      const leftPosition = (index / activeCount) * 100;
                      
                      // Calculate octave for this note
                      const rootNote = sortedActiveNotes[0];
                      const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);
                      const noteIndex = CHROMATIC_NOTES.indexOf(note);
                      
                      // If note comes before root in chromatic order but after in display order,
                      // it should be played at octave+1
                      const shouldRaiseOctave = noteIndex < rootIndex;
                      const noteOctave = shouldRaiseOctave ? rowOctave + 1 : rowOctave;
                      
                      return (
                        <div
                          key={`active-${note}-${index}-${rowOctave}`}
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
                              octave={noteOctave}
                              onPlay={onPlay}
                              onRelease={() => onRelease(`${note}${noteOctave}`)}
                              disabled={!isInitialized}
                              isActive={true}
                              className="w-full h-full text-lg font-bold"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Single octave rendering (original logic)
  return (
    <div className="w-full max-w-6xl mx-auto space-y-1">
      {/* Two-tier dot overlay */}
      <div className="relative h-6">
        {/* Sharp/flat dots (higher tier) */}
        {sharpFlatPositions.map(({ note, left }) => {
          const noteColor = getNoteColorForOctave(note, octave);
          const bgColorClass = noteColor.split(' ')[0];
          
          return (
            <div
              key={`dot-sharp-${note}`}
              className={cn(
                "absolute rounded-full transition-all duration-300 ease-in-out",
                "scale-100 opacity-100",
                bgColorClass
              )}
              style={{
                left: `${left}%`,
                width: '8px',
                height: '8px',
                top: '20%',
                transform: 'translateX(-50%) translateY(-50%)'
              }}
            />
          );
        })}
        
        {/* Natural dots (lower tier) */}
        {naturalPositions.map(({ note, left }) => {
          const noteColor = getNoteColorForOctave(note, octave);
          const bgColorClass = noteColor.split(' ')[0];
          
          return (
            <div
              key={`dot-natural-${note}`}
              className={cn(
                "absolute rounded-full transition-all duration-300 ease-in-out",
                "scale-100 opacity-100",
                bgColorClass
              )}
              style={{
                left: `${left}%`,
                width: '8px',
                height: '8px',
                top: '80%',
                transform: 'translateX(-50%) translateY(-50%)'
              }}
            />
          );
        })}
      </div>

      {/* Keys layout - chromatic gets 2-row, others get single row */}
      {isChromatic ? (
        <div className="space-y-0">
          {/* Sharp/flat keys row (top) */}
          <div className="relative h-14 -mb-2 z-10">
            {activeSharpFlats.map((note) => {
              // Dynamic mapping based on actual natural key order
              const leftOf: Partial<Record<ChromaticNote, ChromaticNote>> = {
                'C#': 'D',
                'D#': 'E',
                'F#': 'G', 
                'G#': 'A',
                'A#': 'B'
              };
              
              const rightNatural = leftOf[note as keyof typeof leftOf];
              const naturalIndex = naturalNotes.indexOf(rightNatural);
              const leftPosition = naturalIndex >= 0 
                ? (naturalIndex / naturalNotes.length) * 100
                : 0;
              
              return (
                <div
                  key={`sharp-${note}`}
                  className={cn(
                    "absolute transition-all duration-300 ease-in-out origin-bottom",
                    isChromatic ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                  )}
                  style={{
                    left: `${leftPosition}%`,
                    width: `${100 / (naturalNotes.length * 1.4)}%`,
                    height: '100%',
                    transform: 'translateX(-50%) translateY(-6px)'
                  }}
                >
                  <div className="p-0.5 h-full">
                    <NoteButton
                      note={note}
                      octave={octave}
                      onPlay={onPlay}
                      onRelease={() => onRelease(`${note}${octave}`)}
                      disabled={!isInitialized}
                      isActive={true}
                      variant="sharp"
                      className="w-full h-full text-sm font-bold"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Natural keys row (bottom) */}
          <div className="relative h-32 md:h-40 lg:h-48">
            {activeNaturals.map((note, index) => {
              const leftPosition = (index / naturalNotes.length) * 100;
              
              return (
                <div
                  key={`natural-${note}`}
                  className="absolute transition-all duration-300 ease-in-out"
                  style={{
                    left: `${leftPosition}%`,
                    width: `${100 / naturalNotes.length}%`,
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
                      variant="natural"
                      className="w-full h-full text-lg font-bold"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Single row layout for non-chromatic views */
        <div className="relative h-40 md:h-48 lg:h-56">
          {sortedActiveNotes.map((note, index) => {
            const leftPosition = (index / activeCount) * 100;
            
            // Calculate correct octave for root-first ordering
            const rootNote = sortedActiveNotes[0];
            const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);
            const noteIndex = CHROMATIC_NOTES.indexOf(note);
            
            // If note comes before root in chromatic order but after in display order,
            // it should be played at octave+1
            const shouldRaiseOctave = noteIndex < rootIndex;
            const noteOctave = shouldRaiseOctave ? octave + 1 : octave;
            
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
                    octave={noteOctave}
                    onPlay={onPlay}
                    onRelease={() => onRelease(`${note}${noteOctave}`)}
                    disabled={!isInitialized}
                    isActive={true}
                    className="w-full h-full text-lg font-bold"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};