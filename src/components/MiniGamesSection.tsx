
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Trophy, Star, Zap, Target, Puzzle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';

const MiniGamesSection = () => {
  const { updateCoins } = useUserData();
  const [dailyPlayed, setDailyPlayed] = useState(false);

  const games = [
    {
      id: 'number-guess',
      title: 'Number Guessing',
      description: 'Guess the number between 1-100',
      icon: Target,
      color: 'bg-blue-500',
      difficulty: 'Easy',
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Match the cards in sequence',
      icon: Puzzle,
      color: 'bg-green-500',
      difficulty: 'Medium',
    },
    {
      id: 'quick-tap',
      title: 'Quick Tap',
      description: 'Tap as fast as you can!',
      icon: Zap,
      color: 'bg-orange-500',
      difficulty: 'Hard',
    },
  ];

  const playNumberGuessing = async () => {
    if (dailyPlayed) {
      toast({
        title: "🎮 Daily Limit Reached",
        description: "You've already played today! Come back tomorrow for more points.",
      });
      return;
    }

    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const userGuess = prompt("🎯 Guess a number between 1 and 100:");
    
    if (userGuess === null) return;
    
    const guess = parseInt(userGuess);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      toast({
        title: "❌ Invalid Input",
        description: "Please enter a valid number between 1 and 100!",
      });
      return;
    }

    const difference = Math.abs(randomNumber - guess);
    let points = 0;
    let message = "";

    if (difference === 0) {
      points = 50;
      message = "🎉 Perfect! You guessed it exactly!";
    } else if (difference <= 5) {
      points = 40;
      message = "🔥 Very close! Amazing guess!";
    } else if (difference <= 10) {
      points = 30;
      message = "👍 Close! Good try!";
    } else if (difference <= 20) {
      points = 20;
      message = "👌 Not bad! Keep practicing!";
    } else {
      points = 10;
      message = "💪 Nice try! You still earn points!";
    }

    await updateCoins(points, 'mini_game', `Number Guessing Game - Guess: ${guess}, Answer: ${randomNumber}`);
    setDailyPlayed(true);

    toast({
      title: message,
      description: `You earned ${points} points! The number was ${randomNumber}.`,
    });
  };

  const playMemoryMatch = async () => {
    if (dailyPlayed) {
      toast({
        title: "🎮 Daily Limit Reached",
        description: "You've already played today! Come back tomorrow for more points.",
      });
      return;
    }

    const sequence = Array.from({length: 4}, () => Math.floor(Math.random() * 4) + 1);
    const userSequence = [];
    
    toast({
      title: "🧠 Memory Challenge",
      description: `Remember this sequence: ${sequence.join(' - ')}`,
    });

    setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        const guess = prompt(`Enter number ${i + 1} from the sequence:`);
        if (guess === null) return;
        userSequence.push(parseInt(guess));
      }

      const correct = userSequence.filter((num, idx) => num === sequence[idx]).length;
      const points = correct * 12.5; // 50 points for perfect match

      updateCoins(Math.floor(points), 'mini_game', `Memory Match Game - ${correct}/4 correct`);
      setDailyPlayed(true);

      toast({
        title: `🧠 Memory Result: ${correct}/4 correct!`,
        description: `You earned ${Math.floor(points)} points!`,
      });
    }, 3000);
  };

  const playQuickTap = async () => {
    if (dailyPlayed) {
      toast({
        title: "🎮 Daily Limit Reached",
        description: "You've already played today! Come back tomorrow for more points.",
      });
      return;
    }

    let taps = 0;
    const startTime = Date.now();
    
    toast({
      title: "⚡ Quick Tap Challenge",
      description: "Tap OK as many times as you can in 10 seconds!",
    });

    const interval = setInterval(() => {
      const response = confirm("TAP! (Click OK to count, Cancel to stop)");
      if (response) {
        taps++;
      } else {
        clearInterval(interval);
        calculateTapScore();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      calculateTapScore();
    }, 10000);

    const calculateTapScore = async () => {
      const points = Math.min(50, Math.floor(taps * 2)); // Max 50 points
      
      await updateCoins(points, 'mini_game', `Quick Tap Game - ${taps} taps`);
      setDailyPlayed(true);

      toast({
        title: `⚡ Quick Tap Result: ${taps} taps!`,
        description: `You earned ${points} points!`,
      });
    };
  };

  const gameHandlers = {
    'number-guess': playNumberGuessing,
    'memory-match': playMemoryMatch,
    'quick-tap': playQuickTap,
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-700">
            <Gamepad2 className="w-6 h-6" />
            Mini Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-white rounded-xl border border-pink-200">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Daily Gaming Rewards
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Play any mini game once per day to earn up to 50 points!
            </p>
            <div className="flex items-center gap-2">
              <Badge variant={dailyPlayed ? "secondary" : "default"} className="bg-pink-100 text-pink-700">
                {dailyPlayed ? "✓ Played Today" : "🎮 Ready to Play"}
              </Badge>
              <Badge variant="outline" className="text-green-600">
                Up to 50 Points
              </Badge>
            </div>
          </div>

          <div className="grid gap-4">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <Card key={game.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${game.color} text-white flex items-center justify-center`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{game.title}</h4>
                          <p className="text-sm text-gray-600">{game.description}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {game.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={gameHandlers[game.id]}
                        disabled={dailyPlayed}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        {dailyPlayed ? "Played" : "Play"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Game Tips:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Each game can be played once per day</li>
              <li>• Better performance = more points earned</li>
              <li>• All games reset at midnight</li>
              <li>• Minimum 10 points guaranteed for trying!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiniGamesSection;
