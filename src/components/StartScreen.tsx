
import React from "react";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";

const StartScreen: React.FC = () => {
  const { startGame } = useGameContext();

  return (
    <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
      <h1 className="text-5xl font-bold">
        <span className="title-ink">Inkbound</span>
        <span className="text-3xl block mt-2">The Lost Pages</span>
      </h1>
      
      <div className="relative">
        <div className="inkblot float-animation absolute -top-12 -right-4 w-10 h-10" />
        <div className="inkblot float-animation absolute -bottom-8 -left-5 w-8 h-8" style={{ animationDelay: '1.5s' }} />
        
        <p className="text-lg text-gray-700 relative z-10">
          You are a living inkblot creature inside a magical storybook where the pages have been scattered and the stories corrupted.
        </p>
      </div>
      
      <p className="text-md text-gray-600">
        Restore the book by jumping between pages, fixing broken narratives, and battling corrupted plotlines.
      </p>
      
      <div className="bg-gray-100 p-4 rounded-md text-sm text-left">
        <h3 className="font-bold mb-2">Controls:</h3>
        <ul className="space-y-1">
          <li>⬅️ ➡️ or <strong>A/D</strong>: Move left/right</li>
          <li>⬆️ or <strong>W/Space</strong>: Jump</li>
          <li><strong>S</strong>: Use Slip power (pass through cracks)</li>
          <li><strong>Esc</strong>: Pause game</li>
        </ul>
      </div>
      
      <Button 
        onClick={startGame}
        className="bg-black hover:bg-gray-800 text-white px-8 py-2 text-lg relative overflow-hidden group"
      >
        <span className="relative z-10">Enter the Story</span>
        <span className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="ink-splash" style={{ width: '120%', height: '120%' }}></div>
        </span>
      </Button>
    </div>
  );
};

export default StartScreen;
