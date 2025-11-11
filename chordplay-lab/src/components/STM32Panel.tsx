import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { chordMap } from "@/data/chordMap";
import { audioManager } from "@/utils/audioManager";

// Check if WebSerial API is available (safe check that won't crash)
const isWebSerialSupported = () => {
  if (typeof navigator === "undefined") {
    return false;
  }
  try {
    // Use type assertion to safely check for serial property
    const nav = navigator as any;
    return nav.serial !== undefined && typeof nav.serial.requestPort === "function";
  } catch (e) {
    return false;
  }
};

export const STM32Panel = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentChord, setCurrentChord] = useState<string | null>(null);
  const portRef = useRef<any>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const textDecoderRef = useRef<TextDecoder | null>(null);
  const bufferRef = useRef<string>("");

  // Map STM32 chord name + quality to chordMap entry
  const findChordByName = (name: string, quality: string) => {
    // Normalize quality: "MAJ" -> "major", "MIN" -> "minor", "7TH" -> "7th"
    const qualityMap: Record<string, "major" | "minor" | "7th"> = {
      "MAJ": "major",
      "MIN": "minor",
      "7TH": "7th",
    };
    const row = qualityMap[quality];
    if (!row) return null;

    // Build chord name like "Eb MAJ", "G MIN", etc.
    const chordName = `${name} ${quality}`;
    return chordMap.find((chord) => chord.chordName === chordName);
  };

  // Process incoming serial data
  const processSerialData = (data: string) => {
    bufferRef.current += data;
    const lines = bufferRef.current.split("\r\n");
    // Keep the last incomplete line in buffer
    bufferRef.current = lines.pop() || "";

    for (const line of lines) {
      if (line.trim() === "") continue;

      // Parse chord messages: "CHORD G MIN" or "CHORD Bb MAJ"
      if (line.startsWith("CHORD ")) {
        // Remove "CHORD " prefix and split the rest
        const chordPart = line.substring(6).trim();
        const parts = chordPart.split(" ");
        if (parts.length >= 2) {
          // Last part is quality (MAJ, MIN, 7TH)
          const quality = parts[parts.length - 1];
          // Everything before last part is chord name (could be "G" or "Bb")
          const chordName = parts.slice(0, -1).join(" ");
          const chord = findChordByName(chordName, quality);
          if (chord) {
            console.log("Playing chord from STM32:", chord.chordName, chord.filePath);
            audioManager.play(chord.filePath);
            setCurrentChord(chord.chordName);
          } else {
            console.warn("Chord not found:", chordName, quality);
          }
        }
      }
      // THEREMIN messages are ignored (not displayed)
      // OMNICHORD READY messages are ignored (not displayed)
    }
  };

  // Read serial data
  const readSerialData = async () => {
    if (!readerRef.current || !textDecoderRef.current) return;

    try {
      while (true) {
        const { value, done } = await readerRef.current.read();
        if (done) {
          console.log("Serial reader done");
          break;
        }
        if (value) {
          const text = textDecoderRef.current.decode(value);
          processSerialData(text);
        }
      }
    } catch (error) {
      console.error("Error reading serial data:", error);
      // Disconnect on error
      if (readerRef.current) {
        try {
          readerRef.current.releaseLock();
        } catch (e) {
          // Ignore release errors
        }
        readerRef.current = null;
      }
      if (portRef.current) {
        try {
          await portRef.current.close();
        } catch (e) {
          // Ignore close errors
        }
        portRef.current = null;
      }
      setIsConnected(false);
      setCurrentChord(null);
    }
  };

  const handleConnect = async () => {
    if (!isWebSerialSupported()) {
      alert("WebSerial API is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    try {
      // Request port access
      const nav = navigator as any;
      if (!nav.serial || typeof nav.serial.requestPort !== "function") {
        throw new Error("WebSerial API not available");
      }
      const port = await nav.serial.requestPort();
      portRef.current = port;

      // Open port with 115200 baud (matching STM32 firmware)
      try {
        await port.open({ baudRate: 115200 });
      } catch (openError: any) {
        // Check if port is already in use
        const errorMsg = openError.message || String(openError);
        if (errorMsg.includes("Failed to open") || errorMsg.includes("access denied") || errorMsg.includes("busy")) {
          throw new Error(
            "Serial port is already in use by another application (like PuTTY, Serial Monitor, etc.). " +
            "Please close all other applications using the serial port and try again."
          );
        }
        throw openError;
      }
      
      setIsConnected(true);
      setCurrentChord(null);

      // Set up reader
      textDecoderRef.current = new TextDecoder();
      const reader = port.readable?.getReader();
      if (reader) {
        readerRef.current = reader;
        // Start reading data
        readSerialData();
      }
    } catch (error: any) {
      console.error("Error connecting to serial port:", error);
      alert(`Connection error: ${error.message || error}\n\nMake sure PuTTY and other serial applications are closed.`);
      setIsConnected(false);
      portRef.current = null;
      setCurrentChord(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Close reader
      if (readerRef.current) {
        await readerRef.current.cancel();
        await readerRef.current.releaseLock();
        readerRef.current = null;
      }

      // Close port
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }

      setIsConnected(false);
      textDecoderRef.current = null;
      bufferRef.current = "";
      setCurrentChord(null);
      // Stop any playing audio
      audioManager.stopCurrent();
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  const handleStopChord = () => {
    audioManager.stopCurrent();
    setCurrentChord(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected && portRef.current) {
        handleDisconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preload all audio files on mount
  useEffect(() => {
    const filePaths = chordMap.map((chord) => chord.filePath);
    audioManager.preloadAll(filePaths).then(() => {
      console.log("STM32Panel: Audio files preloaded");
    });
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Info Panel */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-bold mb-2">STM32 Omnichord/Theremin Board</h2>
        <p className="text-muted-foreground mb-2">
          Connect to the STM32 board via WebSerial to receive real-time chord and theremin data.
          Chord buttons on the board will automatically play sounds when pressed.
        </p>
        {!isWebSerialSupported() && (
          <p className="text-destructive text-sm mt-2">
            ⚠️ WebSerial API is only supported in Chrome/Edge browsers.
          </p>
        )}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 mt-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold mb-1">
            ⚠️ Important: Close PuTTY and other serial port applications
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            The serial port can only be used by one application at a time. Make sure PuTTY, 
            Arduino Serial Monitor, or any other serial terminal is closed before connecting.
          </p>
        </div>
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

      {/* Current Chord Display */}
      <div className="bg-card p-8 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-center text-muted-foreground">Current Chord</h3>
          {currentChord && (
            <Button
              onClick={handleStopChord}
              variant="destructive"
              size="sm"
            >
              Stop
            </Button>
          )}
        </div>
        <div className="flex items-center justify-center min-h-[200px]">
          {currentChord ? (
            <div className="bg-primary text-primary-foreground text-6xl font-bold px-12 py-8 rounded-lg shadow-lg animate-in fade-in duration-200">
              {currentChord}
            </div>
          ) : (
            <div className="text-4xl font-semibold text-muted-foreground">
              {isConnected ? "Waiting for chord..." : "Not connected"}
            </div>
          )}
        </div>
      </div>

      {/* Status Info */}
      <div className="bg-secondary/20 p-4 rounded-lg text-sm text-muted-foreground">
        <p className="font-semibold mb-2">Status:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Connection: {isConnected ? "Connected" : "Not connected"}</li>
          <li>Baud Rate: 115200</li>
          <li>Chord playback: {isConnected ? "Active" : "Waiting for connection"}</li>
          <li>Press chord buttons on STM32 board to play sounds</li>
        </ul>
      </div>
    </div>
  );
};
