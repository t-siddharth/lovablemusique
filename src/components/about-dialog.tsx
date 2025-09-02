import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const AboutDialogButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="opacity-60 hover:opacity-100 transition-opacity"
          aria-label="About ChromatiKeyd"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>About ChromatiKeyd</DialogTitle>
          <DialogDescription>
            A visual music theory tool for exploring scales and harmonies
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">How to Use</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Press and hold any key to play its note</li>
              <li>• Switch between different musical scales using the mode selector</li>
              <li>• Colored keys represent notes in the current scale</li>
              <li>• Gray keys are chromatic notes outside the scale</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Musical Modes</h3>
            <div className="grid gap-3">
              <div>
                <h4 className="font-medium text-sm">Triad</h4>
                <p className="text-xs text-muted-foreground">Three-note chords (1-3-5). Perfect for basic harmony exploration.</p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Pentatonic</h4>
                <p className="text-xs text-muted-foreground">Five-note scale common in folk and world music. Great for improvisation.</p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Major</h4>
                <p className="text-xs text-muted-foreground">Seven-note scale with a bright, happy sound. Foundation of Western music theory.</p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Chromatic</h4>
                <p className="text-xs text-muted-foreground">All twelve notes. Perfect for advanced harmonic exploration.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Tips for Mobile Users</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use a firm touch to ensure proper note triggering</li>
              <li>• If a note gets stuck, tap another key to release it</li>
              <li>• Works best with headphones for optimal audio quality</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};