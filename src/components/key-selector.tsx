import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CHROMATIC_NOTES, getNoteColorParts, type ChromaticNote } from "@/lib/music"

interface KeySelectorProps {
  currentKey: ChromaticNote;
  onKeyChange: (key: ChromaticNote) => void;
  className?: string;
}

export const KeySelector = ({ currentKey, onKeyChange, className }: KeySelectorProps) => {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <label className="text-sm font-medium">Choose Key:</label>
      
      <Select value={currentKey} onValueChange={(value) => onKeyChange(value as ChromaticNote)}>
        <SelectTrigger className="w-32">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <div className={cn("w-4 h-4 rounded-full", getNoteColorParts(currentKey).bg)} />
              <span>{currentKey}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent>
          {CHROMATIC_NOTES.map((note) => (
            <SelectItem key={note} value={note} className="flex items-center">
              <div className="flex items-center space-x-3 w-full">
                <div className={cn("w-4 h-4 rounded-full flex-shrink-0", getNoteColorParts(note).bg)} />
                <span className="font-medium">{note}</span>
                {note === 'C' && <Badge variant="outline" className="ml-auto">Default</Badge>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <p className="text-xs text-muted-foreground">
        All notes will shift to this key
      </p>
    </div>
  );
};