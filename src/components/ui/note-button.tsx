import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getNoteColor, type ChromaticNote } from "@/lib/music"

interface NoteButtonProps {
  note: ChromaticNote;
  octave?: number;
  onPlay: (note: string, frequency: number) => void;
  onRelease?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'h-16 w-16 text-lg',
  md: 'h-20 w-20 text-xl', 
  lg: 'h-24 w-24 text-2xl',
  xl: 'h-32 w-32 text-3xl'
};

const getFrequency = (note: ChromaticNote, octave: number): number => {
  const A4 = 440;
  const noteValues = { C: -9, 'C#': -8, D: -7, 'D#': -6, E: -5, F: -4, 'F#': -3, G: -2, 'G#': -1, A: 0, 'A#': 1, B: 2 };
  const semitoneOffset = noteValues[note] + (octave - 4) * 12;
  return A4 * Math.pow(2, semitoneOffset / 12);
};

export const NoteButton = ({ 
  note, 
  octave = 4, 
  onPlay, 
  onRelease,
  className,
  size = 'lg',
  showLabel = true,
  disabled = false 
}: NoteButtonProps) => {
  const frequency = getFrequency(note, octave);
  
  const handlePress = () => {
    if (!disabled) {
      onPlay(`${note}${octave}`, frequency);
    }
  };

  const handleReleaseEvent = () => {
    if (onRelease) {
      onRelease();
    }
  };

  return (
    <Button
      className={cn(
        sizeClasses[size],
        "font-bold transition-all duration-150 rounded-2xl shadow-lg",
        "active:scale-95 active:shadow-inner",
        "focus:ring-4 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        getNoteColor(note),
        className
      )}
      onTouchStart={handlePress}
      onTouchEnd={handleReleaseEvent}
      onMouseDown={handlePress}
      onMouseUp={handleReleaseEvent}
      onMouseLeave={handleReleaseEvent}
      disabled={disabled}
      aria-label={`Play note ${note}${showLabel ? '' : ` ${octave}`}`}
    >
      {showLabel && (
        <span className="drop-shadow-sm">
          {note}
        </span>
      )}
    </Button>
  );
};