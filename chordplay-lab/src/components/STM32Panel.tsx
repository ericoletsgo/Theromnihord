import { useState } from "react";
import { Button } from "@/components/ui/button";

export const STM32Panel = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    // Placeholder for WebSerial connection
    setMessages((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Attempting to connect to STM32 board...`,
    ]);

    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      setMessages((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Connected to STM32 Omnichord/Theremin`,
      ]);
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setMessages((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Disconnected from board`,
    ]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Info Panel */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-bold mb-2">STM32 Omnichord/Theremin Board</h2>
        <p className="text-muted-foreground">
          This tab will connect to the STM32 Omnichord/Theremin board via WebSerial.
          The board sends real-time data for theremin gestures and chord selections.
        </p>
      </div>

      {/* Connection Controls */}
      <div className="flex gap-4">
        <Button
          onClick={handleConnect}
          disabled={isConnected}
          className="bg-primary hover:bg-primary/90"
        >
          {isConnected ? "Connected" : "Connect to Board"}
        </Button>
        {isConnected && (
          <Button
            onClick={handleDisconnect}
            variant="outline"
          >
            Disconnect
          </Button>
        )}
      </div>

      {/* Message Log */}
      <div className="bg-muted p-4 rounded-lg border border-border">
        <h3 className="font-semibold mb-3">Live Messages</h3>
        <div className="bg-background p-3 rounded min-h-[200px] max-h-[400px] overflow-y-auto font-mono text-xs space-y-1">
          {messages.length === 0 ? (
            <div className="text-muted-foreground">No messages yet. Connect to board to see live data.</div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="text-foreground">
                {msg}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Placeholder for future features */}
      <div className="bg-secondary/20 p-4 rounded-lg text-sm text-muted-foreground">
        <p className="font-semibold mb-2">Future Features:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Real-time THEREMIN position data visualization</li>
          <li>CHORD selection feedback and display</li>
          <li>WebSerial configuration and settings</li>
          <li>Calibration tools for theremin sensors</li>
        </ul>
      </div>
    </div>
  );
};
