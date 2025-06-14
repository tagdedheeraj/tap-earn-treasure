
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Gift } from 'lucide-react';

interface SpinButtonProps {
  canSpin: boolean;
  isSpinning: boolean;
  onSpin: () => void;
  getTimeUntilNextSpin: () => string | null;
}

const SpinButton: React.FC<SpinButtonProps> = ({
  canSpin,
  isSpinning,
  onSpin,
  getTimeUntilNextSpin
}) => {
  return (
    <div className="text-center space-y-4">
      {canSpin ? (
        <Button
          onClick={onSpin}
          disabled={isSpinning}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-16 py-6 text-2xl font-bold shadow-2xl transform transition-all duration-300 hover:scale-110 disabled:scale-100 disabled:opacity-70 rounded-3xl border-4 border-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          {isSpinning ? (
            <>
              <Sparkles className="w-8 h-8 mr-4 animate-spin relative z-10" />
              <span className="relative z-10">Spinning...</span>
            </>
          ) : (
            <>
              <Gift className="w-8 h-8 mr-4 animate-pulse relative z-10" />
              <span className="relative z-10">SPIN NOW!</span>
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <Button disabled className="bg-gray-500 text-gray-300 px-16 py-6 text-2xl font-bold rounded-3xl border-4 border-gray-400 opacity-60">
            Already Spun Today
          </Button>
          <p className="text-white/80 font-medium text-lg">
            Next spin in: <Badge variant="outline" className="font-bold text-yellow-400 bg-yellow-400/10 border-yellow-400/30 text-lg px-3 py-1">{getTimeUntilNextSpin()}</Badge>
          </p>
        </div>
      )}
    </div>
  );
};

export default SpinButton;
