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
        isActive
          ? "bg-primary border-primary shadow-lg scale-95"
          : "bg-card border-border shadow-md hover:border-primary/50"
      )}
    >
      <div className="text-xs font-bold text-muted-foreground mb-1">{keyLabel.toUpperCase()}</div>
      <div className={cn(
        "text-sm font-semibold",
        isActive ? "text-primary-foreground" : "text-foreground"
      )}>
        {chordName}
      </div>
    </button>
  );
};
