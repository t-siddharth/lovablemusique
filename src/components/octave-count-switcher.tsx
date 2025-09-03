import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface OctaveCountSwitcherProps {
  value: number;
  onChange: (value: number) => void;
}

export const OctaveCountSwitcher = ({ value, onChange }: OctaveCountSwitcherProps) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <p className="text-sm text-muted-foreground font-medium">Octaves</p>
      <ToggleGroup
        type="single"
        value={value.toString()}
        onValueChange={(val) => val && onChange(parseInt(val))}
        className="grid grid-cols-3 gap-1"
      >
        <ToggleGroupItem value="1" aria-label="1 octave">
          1
        </ToggleGroupItem>
        <ToggleGroupItem value="2" aria-label="2 octaves">
          2
        </ToggleGroupItem>
        <ToggleGroupItem value="3" aria-label="3 octaves">
          3
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};