import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ChordButtonProps {
  chordName: string;
  keyLabel: string;
  isActive: boolean;
  onPress: () => void;
  onRelease: () => void;
}

export const ChordButton = ({
  chordName,
  keyLabel,
  isActive,
  onPress,
  onRelease,
}: ChordButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsPressed(true);
      const timer = setTimeout(() => setIsPressed(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <button
      onMouseDown={onPress}
      onMouseUp={onRelease}
      onMouseLeave={onRelease}
      className={cn(
        "relative flex flex-col items-center justify-center",
        "h-20 w-full rounded border-2",
        "transition-all duration-150",
        "hover:scale-[0.98] active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isPressed
          ? "bg-chord-pressed border-primary shadow-lg scale-95"
          : "bg-chord-idle border-chord-border shadow-md hover:border-primary/50"
      )}
    >
      <div className="text-xs font-bold text-muted-foreground mb-1">{keyLabel.toUpperCase()}</div>
      <div className={cn(
        "text-sm font-semibold",
        isPressed ? "text-primary-foreground" : "text-foreground"
      )}>
        {chordName}
      </div>
    </button>
  );
};
