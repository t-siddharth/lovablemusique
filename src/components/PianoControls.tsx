import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, Minus, Plus } from "lucide-react";

interface PianoControlsProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  octaveShift: number;
  onOctaveShiftChange: (shift: number) => void;
}

export const PianoControls = ({
  volume,
  onVolumeChange,
  octaveShift,
  onOctaveShiftChange
}: PianoControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-8 flex-wrap">
      {/* Volume Control */}
      <div className="flex items-center gap-4 min-w-48">
        <Volume2 className="w-5 h-5 text-muted-foreground" />
        <Slider
          value={[volume]}
          onValueChange={(value) => onVolumeChange(value[0])}
          max={1}
          min={0}
          step={0.1}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-8 text-right">
          {Math.round(volume * 100)}
        </span>
      </div>

      {/* Octave Shift */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Octave:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOctaveShiftChange(Math.max(-2, octaveShift - 1))}
          disabled={octaveShift <= -2}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-sm font-mono w-8 text-center">
          {octaveShift >= 0 ? `+${octaveShift}` : octaveShift}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOctaveShiftChange(Math.min(2, octaveShift + 1))}
          disabled={octaveShift >= 2}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};