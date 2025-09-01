import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useTone } from '@/hooks/useTone';

const ScalePad = () => {
  const { playNote, stopNote, isInitialized } = useTone();
  const [pressedNotes, setPressedNotes] = useState<Set<string>>(new Set());

  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const handlePointerDown = useCallback((note: string) => {
    const noteWithOctave = `${note}4`;
    playNote(noteWithOctave);
    setPressedNotes(prev => new Set([...prev, note]));
  }, [playNote]);

  const handlePointerUp = useCallback((note: string) => {
    const noteWithOctave = `${note}4`;
    stopNote(noteWithOctave);
    setPressedNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  }, [stopNote]);

  const handlePointerCancel = useCallback((note: string) => {
    handlePointerUp(note);
  }, [handlePointerUp]);

  const handlePointerLeave = useCallback((note: string) => {
    handlePointerUp(note);
  }, [handlePointerUp]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Scale Pad</h1>
        <p className="text-muted-foreground">Hold to sustain notes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-6xl w-full">
        {notes.map((note) => (
          <Button
            key={note}
            variant={pressedNotes.has(note) ? "default" : "outline"}
            size="lg"
            className="h-24 text-xl font-semibold rounded-lg select-none"
            disabled={!isInitialized}
            onPointerDown={() => handlePointerDown(note)}
            onPointerUp={() => handlePointerUp(note)}
            onPointerCancel={() => handlePointerCancel(note)}
            onPointerLeave={() => handlePointerLeave(note)}
          >
            {note}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ScalePad;