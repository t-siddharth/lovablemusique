import { useState } from 'react';
import { NoteButton } from './ui/note-button';
import { ScaleSwitcher } from './scale-switcher';
import { KeySelector } from './key-selector';
import { SCALES, transposeScale, type ChromaticNote, type ScaleType } from '@/lib/music';
import { useTone } from '@/hooks/useTone';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MusicApp = () => {
  const [currentScale, setCurrentScale] = useState<ScaleType>('pentatonic');
  const [currentKey, setCurrentKey] = useState<ChromaticNote>('C');
  const [octave] = useState(4);
  
  const { playNote, stopNote, isInitialized } = useTone();

  const currentNotes = transposeScale(SCALES[currentScale], currentKey);

  const handlePlayNote = (noteString: string, frequency: number) => {
    playNote(noteString);
  };

  const handleReleaseNote = (noteString: string) => {
    stopNote(noteString);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      {/* Header with Colors Guide Link */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-2">Music Pad</h1>
          <p className="text-muted-foreground">Choose your scale and key, then play!</p>
        </div>
        <Link to="/colors-guide">
          <Button variant="outline" size="sm">
            <Palette className="w-4 h-4 mr-2" />
            Colors Guide
          </Button>
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-8 items-start justify-center mb-8">
        <ScaleSwitcher 
          currentScale={currentScale} 
          onScaleChange={setCurrentScale} 
        />
        <KeySelector 
          currentKey={currentKey} 
          onKeyChange={setCurrentKey} 
        />
      </div>

      {/* Note Grid */}
      <div className={cn(
        "grid gap-4 max-w-4xl w-full justify-center",
        currentNotes.length <= 3 && "grid-cols-3",
        currentNotes.length === 5 && "grid-cols-3 md:grid-cols-5",
        currentNotes.length === 7 && "grid-cols-3 md:grid-cols-4 lg:grid-cols-7",
        currentNotes.length === 12 && "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      )}>
        {currentNotes.map((note, index) => (
          <NoteButton
            key={`${note}-${index}`}
            note={note}
            octave={octave}
            onPlay={handlePlayNote}
            onRelease={() => handleReleaseNote(`${note}${octave}`)}
            size="xl"
            disabled={!isInitialized}
          />
        ))}
      </div>
    </div>
  );
};