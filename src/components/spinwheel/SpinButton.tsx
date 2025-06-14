
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
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-12 py-6 text-xl font-bold shadow-2xl transform transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-70 rounded-2xl border-4 border-white"
        >
          {isSpinning ? (
            <>
              <Sparkles className="w-6 h-6 mr-3 animate-spin" />
              Spinning...
            </>
          ) : (
            <>
              <Gift className="w-6 h-6 mr-3 animate-pulse" />
              SPIN NOW!
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <Button disabled className="bg-gray-500 text-gray-300 px-12 py-6 text-xl font-bold rounded-2xl border-4 border-gray-400 opacity-60">
            Already Spin Today
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
