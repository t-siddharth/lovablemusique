import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NoteButton } from "@/components/ui/note-button";
import { CHROMATIC_NOTES, CHROMATIC_COLORS, getNoteColor, getNoteColorParts, type ChromaticNote } from "@/lib/music";
import { cn } from "@/lib/utils";
import { ArrowLeft, Palette, Music, Code, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const ColorsGuide = () => {
  const playDemoNote = (note: string, frequency: number) => {
    console.log(`Demo: Playing ${note} at ${frequency}Hz`);
  };

  // Helper function for octave-specific color classes
  const getOctaveVariantClasses = (note: ChromaticNote, octave: 3 | 4 | 5): string => {
    const { bg: baseBg } = getNoteColorParts(note);
    const baseColor = baseBg.replace('bg-', '').replace('-500', '');
    
    switch (octave) {
      case 3:
        return `bg-${baseColor}-300 hover:bg-${baseColor}-400 text-black`;
      case 4:
        return getNoteColor(note); // Use current mapping
      case 5:
        return `bg-${baseColor}-700 hover:bg-${baseColor}-800 text-white`;
      default:
        return getNoteColor(note);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to App
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Palette className="w-8 h-8" />
                Color System Guide
              </h1>
              <p className="text-muted-foreground mt-2">
                Complete documentation for the musical note color mapping system
              </p>
            </div>
          </div>
        </div>

        {/* Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              System Overview
            </CardTitle>
            <CardDescription>
              Our color system maps each of the 12 chromatic notes to a unique color, creating visual consistency across the musical interface.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Consistent color-to-note mapping across all components</li>
                  <li>• High contrast text colors for accessibility</li>
                  <li>• Hover states with darker variants</li>
                  <li>• Color wheel arrangement following musical intervals</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technologies:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• TypeScript for type safety</li>
                  <li>• Tailwind CSS utility classes</li>
                  <li>• Chromatic note type definitions</li>
                  <li>• Centralized color constants</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Chromatic Color Palette</CardTitle>
            <CardDescription>
              Each musical note is assigned a specific color from the spectrum, arranged in chromatic order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {CHROMATIC_NOTES.map((note) => {
                const colorClasses = getNoteColor(note);
                const bgClass = colorClasses.split(' ')[0];
                const textClass = colorClasses.split(' ').find(c => c.startsWith('text-'));
                
                return (
                  <div key={note} className="text-center space-y-2">
                    <div
                      className={cn(
                        "w-16 h-16 mx-auto rounded-lg shadow-md border-2 border-border",
                        "flex items-center justify-center font-bold text-lg",
                        bgClass,
                        textClass
                      )}
                    >
                      {note}
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="font-medium">{note}</div>
                      <Badge variant="secondary" className="text-xs">
                        {bgClass.replace('bg-', '')}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Octave-aware Color Variants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Octave-aware Color Variants
            </CardTitle>
            <CardDescription>
              Different octaves use varying color intensities: Octave 3 (lighter), Octave 4 (base), Octave 5 (darker).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color intensity grid */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline">Octave 5</Badge>
                  Darker intensity (700/800) with white text
                </h4>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                  {CHROMATIC_NOTES.map((note) => (
                    <div key={`5-${note}`} className="text-center">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm",
                          getOctaveVariantClasses(note, 5)
                        )}
                      >
                        {note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline">Octave 4</Badge>
                  Base intensity (500/600) - current mapping
                </h4>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                  {CHROMATIC_NOTES.map((note) => (
                    <div key={`4-${note}`} className="text-center">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm",
                          getOctaveVariantClasses(note, 4)
                        )}
                      >
                        {note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline">Octave 3</Badge>
                  Lighter intensity (300) with black text
                </h4>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                  {CHROMATIC_NOTES.map((note) => (
                    <div key={`3-${note}`} className="text-center">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm",
                          getOctaveVariantClasses(note, 3)
                        )}
                      >
                        {note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Demo</CardTitle>
            <CardDescription>
              Click the note buttons below to see both base colors and octave variants in action.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Base demo */}
            <div>
              <h4 className="font-semibold mb-3">Base Color System (Octave 4)</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {CHROMATIC_NOTES.slice(0, 6).map((note) => (
                  <NoteButton
                    key={note}
                    note={note}
                    octave={4}
                    onPlay={playDemoNote}
                    size="md"
                    className="mx-auto"
                  />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-3">
                {CHROMATIC_NOTES.slice(6).map((note) => (
                  <NoteButton
                    key={note}
                    note={note}
                    octave={4}
                    onPlay={playDemoNote}
                    size="md"
                    className="mx-auto"
                  />
                ))}
              </div>
            </div>

            {/* Octave variants demo */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline">Octave 5</Badge>
                  Darker Variants
                </h4>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {CHROMATIC_NOTES.slice(0, 8).map((note) => (
                    <NoteButton
                      key={`demo-5-${note}`}
                      note={note}
                      octave={5}
                      onPlay={playDemoNote}
                      size="sm"
                      className={cn("mx-auto", getOctaveVariantClasses(note, 5))}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline">Octave 3</Badge>
                  Lighter Variants
                </h4>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {CHROMATIC_NOTES.slice(0, 8).map((note) => (
                    <NoteButton
                      key={`demo-3-${note}`}
                      note={note}
                      octave={3}
                      onPlay={playDemoNote}
                      size="sm"
                      className={cn("mx-auto", getOctaveVariantClasses(note, 3))}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Technical Implementation
            </CardTitle>
            <CardDescription>
              Code structure and usage examples for developers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Structure */}
            <div>
              <h4 className="font-semibold mb-3">File Structure</h4>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <div>src/types/music.ts - ChromaticNote type definition</div>
                <div>src/constants/colors.ts - Color mappings</div>
                <div>src/utilities/music.ts - Helper functions</div>
                <div>src/lib/music/index.ts - Barrel exports</div>
              </div>
            </div>

            <Separator />

            {/* Code Examples */}
            <div>
              <h4 className="font-semibold mb-3">Usage Examples</h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium mb-2">1. Import the color system:</h5>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    <code>{`import { getNoteColor, type ChromaticNote } from '@/lib/music';`}</code>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">2. Get color classes for a note:</h5>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    <code>{`const colorClasses = getNoteColor('C'); // 'bg-red-500 hover:bg-red-600 text-white'`}</code>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">3. Use in a component:</h5>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    <code>{`<Button className={cn("base-styles", getNoteColor(note))}>
  {note}
</Button>`}</code>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Color Mapping Table */}
            <div>
              <h4 className="font-semibold mb-3">Complete Color Mapping</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border rounded-lg">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="p-3 text-left">Note</th>
                      <th className="p-3 text-left">Background</th>
                      <th className="p-3 text-left">Hover</th>
                      <th className="p-3 text-left">Text</th>
                      <th className="p-3 text-left">Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(CHROMATIC_COLORS).map(([note, classes]) => {
                      const parts = classes.split(' ');
                      const bg = parts.find(c => c.startsWith('bg-') && !c.includes('hover'));
                      const hover = parts.find(c => c.includes('hover:bg-'));
                      const text = parts.find(c => c.startsWith('text-'));
                      
                      return (
                        <tr key={note} className="border-b border-border">
                          <td className="p-3 font-medium">{note}</td>
                          <td className="p-3 font-mono text-xs">{bg}</td>
                          <td className="p-3 font-mono text-xs">{hover}</td>
                          <td className="p-3 font-mono text-xs">{text}</td>
                          <td className="p-3">
                            <div
                              className={cn(
                                "w-8 h-8 rounded flex items-center justify-center text-xs font-bold",
                                bg,
                                text
                              )}
                            >
                              {note}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <Separator />

            {/* Customization Guide */}
            <div>
              <h4 className="font-semibold mb-3">Customization Guide</h4>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>To modify colors:</strong> Edit the CHROMATIC_COLORS object in{" "}
                  <code className="bg-muted px-2 py-1 rounded">src/constants/colors.ts</code>
                </p>
                <p>
                  <strong>Contrast requirements:</strong> Ensure sufficient contrast between background and text colors for accessibility.
                </p>
                <p>
                  <strong>Format:</strong> Each entry should include background, hover background, and text color classes.
                </p>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs">
                  <code>{`'C': 'bg-red-500 hover:bg-red-600 text-white'`}</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColorsGuide;