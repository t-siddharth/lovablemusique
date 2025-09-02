import { useState, useEffect } from 'react';
import { PianoGrid } from './piano-grid';
import { ScaleSwitcher } from './scale-switcher';
import { ChromatiKeydTitle } from './chromati-keyd-title';
import { AboutDialogButton } from './about-dialog';
import { SCALES, transposeScale, type ChromaticNote, type ScaleType } from '@/lib/music';
import { useTone } from '@/hooks/useTone';
export const MusicApp = () => {
  const [currentScale, setCurrentScale] = useState<ScaleType>('pentatonic');
  const [currentKey, setCurrentKey] = useState<ChromaticNote>('C');
  const [octave] = useState(4);
  const {
    playNote,
    stopNote,
    stopAllNotes,
    isInitialized
  } = useTone();
  const currentNotes = transposeScale(SCALES[currentScale], currentKey);

  // Global failsafe to prevent stuck notes on app focus loss
  useEffect(() => {
    const handleBlur = () => stopAllNotes();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopAllNotes();
      }
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stopAllNotes]);
  const handlePlayNote = (noteString: string, frequency: number) => {
    playNote(noteString);
  };
  const handleReleaseNote = (noteString: string) => {
    stopNote(noteString);
  };
  return <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 relative">
      {/* About Button - Top Right */}
      <div className="absolute top-4 right-4">
        <AboutDialogButton />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <ChromatiKeydTitle />
        
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-8 items-start justify-center mb-8">
        <ScaleSwitcher currentScale={currentScale} onScaleChange={setCurrentScale} />
      </div>

      {/* Piano Grid */}
      <PianoGrid
        activeNotes={currentNotes}
        octave={octave}
        onPlay={handlePlayNote}
        onRelease={handleReleaseNote}
        isInitialized={isInitialized}
      />
    </div>;
};