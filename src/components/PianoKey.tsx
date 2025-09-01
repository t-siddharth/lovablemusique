import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface PianoKeyProps {
  note: string;
  isBlack: boolean;
  isPressed: boolean;
  onPress: () => void;
  onRelease: () => void;
  keyboardKey?: string;
  style?: CSSProperties;
}

export const PianoKey = ({
  note,
  isBlack,
  isPressed,
  onPress,
  onRelease,
  keyboardKey,
  style
}: PianoKeyProps) => {
  const handleMouseDown = () => {
    onPress();
  };

  const handleMouseUp = () => {
    onRelease();
  };

  const handleMouseLeave = () => {
    onRelease();
  };

  return (
    <button
      className={cn(
        "select-none transition-all duration-75 font-mono text-xs font-medium",
        "active:scale-95 hover:brightness-105",
        isBlack
          ? cn(
              "absolute w-8 h-32 bg-gradient-black-key border border-border/20",
              "rounded-b-lg shadow-key z-10",
              "text-piano-white-key/60 flex items-end justify-center pb-2",
              isPressed
                ? "bg-piano-black-key-pressed shadow-key-pressed transform translate-y-0.5"
                : "hover:bg-gradient-to-b hover:from-piano-black-key-pressed hover:to-piano-black-key"
            )
          : cn(
              "w-14 h-48 bg-gradient-white-key border border-border/10",
              "rounded-b-lg shadow-key",
              "text-piano-black-key/60 flex items-end justify-center pb-4",
              isPressed
                ? "bg-piano-white-key-pressed shadow-key-pressed transform translate-y-0.5"
                : "hover:bg-gradient-to-b hover:from-piano-white-key hover:to-piano-white-key-pressed"
            )
      )}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {keyboardKey && (
        <span className="opacity-50 uppercase">
          {keyboardKey}
        </span>
      )}
    </button>
  );
};