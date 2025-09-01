import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ScaleType } from "@/lib/music"

interface ScaleSwitcherProps {
  currentScale: ScaleType;
  onScaleChange: (scale: ScaleType) => void;
  className?: string;
}

const scaleOptions = [
  { type: 'triad' as const, notes: 3, label: 'Simple', description: 'Perfect for toddlers' },
  { type: 'pentatonic' as const, notes: 5, label: 'Pentatonic', description: 'Never sounds wrong' },
  { type: 'major' as const, notes: 7, label: 'Major Scale', description: 'Traditional scale' },
  { type: 'chromatic' as const, notes: 12, label: 'All Notes', description: 'Full piano' }
];

export const ScaleSwitcher = ({ currentScale, onScaleChange, className }: ScaleSwitcherProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {scaleOptions.map(({ type, notes, label, description }) => (
        <Button
          key={type}
          variant={currentScale === type ? "default" : "outline"}
          className={cn(
            "relative flex flex-col items-center p-4 h-auto min-w-24",
            currentScale === type && "ring-2 ring-offset-2 ring-primary"
          )}
          onClick={() => onScaleChange(type)}
        >
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold"
          >
            {notes}
          </Badge>
          
          <span className="font-semibold text-sm">{label}</span>
          <span className="text-xs text-muted-foreground mt-1">{description}</span>
        </Button>
      ))}
    </div>
  );
};