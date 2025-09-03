import { useState, useEffect } from 'react';
import { PianoGrid } from './piano-grid';
import { ScaleSwitcher } from './scale-switcher';
import { KeySelector } from './key-selector';
import { ChromatiKeydTitle } from './chromati-keyd-title';
import { AboutDialogButton } from './about-dialog';
import { OctaveRowSelector } from './octave-row-selector';
import { SCALES, transposeScale, type ChromaticNote, type ScaleType } from '@/lib/music';
import { useTone } from '@/hooks/useTone';
export const MusicApp = () => {
  const [currentScale, setCurrentScale] = useState<ScaleType>('pentatonic');
  const [currentKey, setCurrentKey] = useState<ChromaticNote>('C');
  const [octave] = useState(4);
  const [visibleOctaves, setVisibleOctaves] = useState<number[]>([4]); // Start with only C4 visible
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

  const handleKeyChange = (key: ChromaticNote) => {
    stopAllNotes(); // Prevent stuck notes when changing key
    setCurrentKey(key);
  };
  return <div className="min-h-[100svh] bg-background flex flex-col items-center justify-between p-8 relative">
      {/* Key Selector and Octave Row Selector - Top Left */}
      <div className="absolute top-4 left-4 flex gap-4 items-start">
        <KeySelector currentKey={currentKey} onKeyChange={handleKeyChange} />
        <OctaveRowSelector visibleOctaves={visibleOctaves} onChange={setVisibleOctaves} />
      </div>

      {/* About Button - Top Right */}
      <div className="absolute top-4 right-4">
        <AboutDialogButton />
      </div>

      {/* Header and Controls - Top Section */}
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <ChromatiKeydTitle />
        </div>
        
        <div className="flex flex-wrap gap-8 items-start justify-center">
          <ScaleSwitcher currentScale={currentScale} onScaleChange={setCurrentScale} />
        </div>
      </div>

      {/* Piano Grid - Bottom Section */}
      <div className="w-full pb-[calc(env(safe-area-inset-bottom,0px)+16px)]">
        <PianoGrid
          activeNotes={currentNotes}
          octave={octave}
          visibleOctaves={visibleOctaves}
          onPlay={handlePlayNote}
          onRelease={handleReleaseNote}
          isInitialized={isInitialized}
        />
      </div>
    </div>;
};