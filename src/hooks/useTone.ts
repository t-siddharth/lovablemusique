import { useRef, useCallback, useEffect, useState } from 'react';
import * as Tone from 'tone';

export const useTone = () => {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const volumeRef = useRef<Tone.Volume | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeTone = async () => {
      try {
        // Minimize audio scheduling latency
        Tone.getContext().lookAhead = 0;
        
        // Create audio chain: PolySynth -> Reverb -> Volume -> Destination
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: "triangle"
          },
          envelope: {
            attack: 0.001, // Much faster attack for immediate response
            decay: 0.15,
            sustain: 0.3,
            release: 0.4 // Shorter release for snappier feel
          }
        });

        reverbRef.current = new Tone.Reverb({
          decay: 1.2,
          wet: 0.1 // Reduced reverb for cleaner attack
        });

        volumeRef.current = new Tone.Volume(-10); // Start at reasonable level

        // Connect the audio chain
        await reverbRef.current.generate();
        synthRef.current.chain(reverbRef.current, volumeRef.current, Tone.Destination);

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Tone.js:', error);
      }
    };

    initializeTone();

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      if (reverbRef.current) {
        reverbRef.current.dispose();
      }
      if (volumeRef.current) {
        volumeRef.current.dispose();
      }
    };
  }, []);

  const startAudio = useCallback(async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
  }, []);

  const playNote = useCallback(async (note: string, octaveShift: number = 0) => {
    if (!synthRef.current || !isInitialized) return;

    await startAudio();
    
    // Convert note format (e.g., "C4" -> "C4") and apply octave shift
    const baseNote = note.slice(0, -1);
    const baseOctave = parseInt(note.slice(-1));
    const adjustedOctave = baseOctave + octaveShift;
    const adjustedNote = `${baseNote}${adjustedOctave}`;

    synthRef.current.triggerAttack(adjustedNote, Tone.now());
  }, [isInitialized, startAudio]);

  const stopNote = useCallback((note: string, octaveShift: number = 0) => {
    if (!synthRef.current || !isInitialized) return;

    // Convert note format and apply octave shift
    const baseNote = note.slice(0, -1);
    const baseOctave = parseInt(note.slice(-1));
    const adjustedOctave = baseOctave + octaveShift;
    const adjustedNote = `${baseNote}${adjustedOctave}`;

    synthRef.current.triggerRelease(adjustedNote, Tone.now());
  }, [isInitialized]);

  const setVolume = useCallback((volume: number) => {
    if (!volumeRef.current) return;
    
    // Convert 0-1 range to decibels (-40 to 0)
    const dbValue = volume === 0 ? -Infinity : Tone.gainToDb(volume);
    volumeRef.current.volume.rampTo(dbValue, 0.1);
  }, []);

  const stopAllNotes = useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.releaseAll();
  }, []);

  return {
    playNote,
    stopNote,
    setVolume,
    stopAllNotes,
    isInitialized,
    startAudio
  };
};