import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ScaleType } from "@/lib/music"
import { Triangle, Star, Rainbow, Clock } from "lucide-react"

interface ScaleSwitcherProps {
  currentScale: ScaleType;
  onScaleChange: (scale: ScaleType) => void;
  className?: string;
}

const scaleOptions = [
  { type: 'triad' as const, notes: 3, Icon: Triangle, aria: 'Triad (3 notes)' },
  { type: 'pentatonic' as const, notes: 5, Icon: Star, aria: 'Pentatonic (5 notes)' },
  { type: 'major' as const, notes: 7, Icon: Rainbow, aria: 'Major Scale (7 notes)' },
  { type: 'chromatic' as const, notes: 12, Icon: Clock, aria: 'All Notes (12 notes)' }
];

export const ScaleSwitcher = ({ currentScale, onScaleChange, className }: ScaleSwitcherProps) => {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {scaleOptions.map(({ type, notes, Icon, aria }) => (
        <Button
          key={type}
          variant={currentScale === type ? "default" : "outline"}
          size="icon"
          className={cn(
            "relative h-12 w-12 rounded-full",
            currentScale === type && "ring-2 ring-offset-2 ring-primary"
          )}
          onClick={() => onScaleChange(type)}
          aria-label={aria}
          title={aria}
        >
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold"
          >
            {notes}
          </Badge>
          
          <Icon className="h-6 w-6" />
        </Button>
      ))}
    </div>
  );
};