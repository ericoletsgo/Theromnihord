import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChordGrid } from "@/components/ChordGrid";
import { STM32Panel } from "@/components/STM32Panel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("browser");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            Omnichord Lab
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Virtual chord instrument and STM32 board interface
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="browser">Browser Omnichord</TabsTrigger>
            <TabsTrigger value="stm32">STM32 Board</TabsTrigger>
          </TabsList>

          <TabsContent value="browser" className="mt-0">
            <ChordGrid />
          </TabsContent>

          <TabsContent value="stm32" className="mt-0">
            <STM32Panel />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-2">
          <div>Built with React + Vite • Omnichord Lab v1.0</div>
          <div className="text-xs">
            Inspired by{" "}
            <a
              href="https://www.onlineomnichord.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              onlineomnichord.com
            </a>
            {" • "}
            <a
              href="https://github.com/arcticmatt/online-omnichord"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
