
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QuizSectionProps {
  totalCoins: number;
  setTotalCoins: (coins: number) => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ totalCoins, setTotalCoins }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);

  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2,
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: 1,
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correct: 2,
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correct: 3,
    },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !showResult && timeLeft > 0 && !isAnswered) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [quizStarted, timeLeft, showResult, isAnswered]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResult(true);
    const coinsEarned = score * 5; // 5 coins per correct answer
    setTotalCoins(totalCoins + coinsEarned);
    
    toast({
      title: "Quiz Completed! 🎉",
      description: `You scored ${score}/${questions.length} and earned ${coinsEarned} coins!`,
    });
  };

  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white">
              <BookOpen className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl">Daily Quiz</CardTitle>
            <p className="text-gray-600">Test your knowledge and earn coins!</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-blue-600">5</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-green-600">25</p>
                <p className="text-sm text-gray-600">Max Coins</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Quiz Rules:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 5 coins per correct answer</li>
                <li>• 30 seconds per question</li>
                <li>• One quiz per day</li>
                <li>• No skipping questions</li>
              </ul>
            </div>
            
            <Button 
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-3"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto flex items-center justify-center text-white">
            <Trophy className="w-10 h-10" />
          </div>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-green-600">{score}/{questions.length}</p>
            <p className="text-gray-600">Correct Answers</p>
            <Badge className="bg-green-500 text-white text-lg px-4 py-2">
              +{score * 5} Coins Earned
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg text-center border">
              <p className="text-xl font-bold text-green-600">{Math.round((score / questions.length) * 100)}%</p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center border">
              <p className="text-xl font-bold text-blue-600">18h</p>
              <p className="text-sm text-gray-600">Next Quiz</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setQuizStarted(false)}
            className="w-full"
            variant="outline"
          >
            Back to Quiz Menu
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge variant="outline">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-500" />
            <span className={`font-mono ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-600'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left border rounded-lg transition-colors ";
              
              if (isAnswered) {
                if (index === currentQ.correct) {
                  buttonClass += "bg-green-100 border-green-500 text-green-700";
                } else if (index === selectedAnswer && index !== currentQ.correct) {
                  buttonClass += "bg-red-100 border-red-500 text-red-700";
                } else {
                  buttonClass += "bg-gray-50 border-gray-300 text-gray-500";
                }
              } else {
                buttonClass += "hover:bg-blue-50 hover:border-blue-300";
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isAnswered && index === currentQ.correct && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {isAnswered && index === selectedAnswer && index !== currentQ.correct && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Score: {score}/{currentQuestion + (isAnswered ? 1 : 0)} • Potential: +{score * 5} coins
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizSection;
