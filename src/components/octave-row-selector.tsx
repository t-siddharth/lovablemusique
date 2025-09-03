import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface OctaveRowSelectorProps {
  visibleOctaves: number[];
  onChange: (octaves: number[]) => void;
}

export const OctaveRowSelector = ({ visibleOctaves, onChange }: OctaveRowSelectorProps) => {
  const handleToggle = (octave: number) => {
    // C4 (octave 4) cannot be toggled off - always keep it
    if (octave === 4) return;
    
    if (visibleOctaves.includes(octave)) {
      onChange(visibleOctaves.filter(o => o !== octave));
    } else {
      onChange([...visibleOctaves, octave].sort().reverse()); // Sort descending (C5, C4, C3)
    }
  };

  const isActive = (octave: number) => visibleOctaves.includes(octave);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex gap-1">
        {/* C3 Button */}
        <button
          onClick={() => handleToggle(3)}
          className={`
            px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive(3) 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }
          `}
          aria-label="Toggle C3 octave"
        >
          C3
        </button>

        {/* C4 Button (always active, more prominent) */}
        <button
          className="px-4 py-2 rounded-md text-sm font-bold bg-primary text-primary-foreground shadow-md scale-105"
          disabled
          aria-label="C4 octave (always visible)"
        >
          C4
        </button>

        {/* C5 Button */}
        <button
          onClick={() => handleToggle(5)}
          className={`
            px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive(5) 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }
          `}
          aria-label="Toggle C5 octave"
        >
          C5
        </button>
      </div>
    </div>
  );
};
