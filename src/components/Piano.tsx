import { useState, useEffect, useCallback, useRef } from "react";
import { PianoKey } from "./PianoKey";
import { PianoControls } from "./PianoControls";
import { toast } from "sonner";

// Piano note frequencies (C4 to B5 - 2 octaves)
const noteFrequencies = {
  C4: 261.63, 'C#4': 277.18, D4: 293.66, 'D#4': 311.13, E4: 329.63, F4: 349.23, 'F#4': 369.99, G4: 392.00, 'G#4': 415.30, A4: 440.00, 'A#4': 466.16, B4: 493.88,
  C5: 523.25, 'C#5': 554.37, D5: 587.33, 'D#5': 622.25, E5: 659.25, F5: 698.46, 'F#5': 739.99, G5: 783.99, 'G#5': 830.61, A5: 880.00, 'A#5': 932.33, B5: 987.77
};

// Keyboard mapping
const keyMap: { [key: string]: string } = {
  'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4', 'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4', 'u': 'A#4', 'j': 'B4',
  'k': 'C5', 'o': 'C#5', 'l': 'D5', 'p': 'D#5', ';': 'E5', "'": 'F5', ']': 'F#5', 'Enter': 'G5', '\\': 'G#5'
};

export const Piano = () => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(0.3);
  const [octaveShift, setOctaveShift] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());

  // Initialize audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        toast("Piano ready! Use your keyboard or click the keys to play.");
      } catch (error) {
        toast("Audio not supported in this browser");
      }
    };
    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playNote = useCallback((note: string) => {
    if (!audioContextRef.current || pressedKeys.has(note)) return;

    const frequency = noteFrequencies[note as keyof typeof noteFrequencies];
    if (!frequency) return;

    // Apply octave shift
    const adjustedFrequency = frequency * Math.pow(2, octaveShift);

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(adjustedFrequency, audioContextRef.current.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContextRef.current.currentTime + 0.01);

    oscillator.start();
    oscillatorsRef.current.set(note, oscillator);

    setPressedKeys(prev => new Set([...prev, note]));
  }, [volume, octaveShift, pressedKeys]);

  const stopNote = useCallback((note: string) => {
    const oscillator = oscillatorsRef.current.get(note);
    if (!oscillator || !audioContextRef.current) return;

    const gainNode = oscillator.context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    gainNode.gain.setValueAtTime(volume * 0.3, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.1);

    setTimeout(() => {
      oscillator.stop();
      oscillatorsRef.current.delete(note);
    }, 100);

    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  }, [volume]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const note = keyMap[event.key.toLowerCase()];
      if (note && !event.repeat) {
        event.preventDefault();
        playNote(note);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = keyMap[event.key.toLowerCase()];
      if (note) {
        event.preventDefault();
        stopNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playNote, stopNote]);

  const whiteKeys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'];
  const blackKeys = ['C#4', 'D#4', 'F#4', 'G#4', 'A#4', 'C#5', 'D#5', 'F#5', 'G#5', 'A#5'];

  return (
    <div className="min-h-screen bg-piano-background flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        <div className="bg-gradient-panel rounded-2xl p-8 shadow-panel mb-8">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Digital Piano
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Play with your computer keyboard or click the keys
          </p>
          
          <PianoControls 
            volume={volume}
            onVolumeChange={setVolume}
            octaveShift={octaveShift}
            onOctaveShiftChange={setOctaveShift}
          />
        </div>

        <div className="relative bg-piano-panel rounded-2xl p-8 shadow-panel">
          {/* Piano keyboard container */}
          <div className="relative flex justify-center">
            {/* White keys */}
            <div className="flex">
              {whiteKeys.map((note, index) => (
                <PianoKey
                  key={note}
                  note={note}
                  isBlack={false}
                  isPressed={pressedKeys.has(note)}
                  onPress={() => playNote(note)}
                  onRelease={() => stopNote(note)}
                  keyboardKey={Object.keys(keyMap).find(key => keyMap[key] === note)}
                />
              ))}
            </div>

            {/* Black keys - positioned absolutely */}
            <div className="absolute top-0 flex">
              {blackKeys.map((note, index) => {
                // Calculate position based on white key positions
                const positions = [0.5, 1.5, 3.5, 4.5, 5.5, 7.5, 8.5, 10.5, 11.5, 12.5];
                const leftPosition = positions[index] * 60; // 60px is white key width
                
                return (
                  <PianoKey
                    key={note}
                    note={note}
                    isBlack={true}
                    isPressed={pressedKeys.has(note)}
                    onPress={() => playNote(note)}
                    onRelease={() => stopNote(note)}
                    style={{ left: `${leftPosition}px` }}
                    keyboardKey={Object.keys(keyMap).find(key => keyMap[key] === note)}
                  />
                );
              })}
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Use your keyboard: A-J keys for white notes, W-U keys for black notes
          </div>
        </div>
      </div>
    </div>
  );
};