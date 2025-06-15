
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface SpinButtonProps {
  onSpin: () => void;
  isSpinning: boolean;
  spinsLeft: number;
}

const SpinButton = ({ onSpin, isSpinning, spinsLeft }: SpinButtonProps) => {
  return (
    <div className="text-center mt-6">
      <Button
        onClick={onSpin}
        disabled={isSpinning || spinsLeft <= 0}
        className="w-28 h-28 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base shadow-2xl transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSpinning ? (
          <div className="flex flex-col items-center">
            <RotateCcw className="w-6 h-6 animate-spin mb-1" />
            <span className="text-sm">Spinning...</span>
          </div>
        ) : spinsLeft > 0 ? (
          <div className="flex flex-col items-center">
            <RotateCcw className="w-6 h-6 mb-1" />
            <span>SPIN</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-sm">No Spins</span>
            <span className="text-sm">Left</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default SpinButton;
