
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

const QuizSection: React.FC = () => {
  const { wallet, updateCoins } = useUserData();
  const { notifyQuizCompleted } = useNotifications();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizCompletedToday, setQuizCompletedToday] = useState(false);

  useEffect(() => {
    if (user) {
      checkQuizStatus();
    }
  }, [user]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !showResult && timeLeft > 0 && !isAnswered) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [quizStarted, timeLeft, showResult, isAnswered]);

  const checkQuizStatus = async () => {
    if (!user) return;

    try {
      const { data: quizSession } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const today = new Date().toISOString().split('T')[0];
      const completedToday = quizSession?.last_quiz_date === today;
      setQuizCompletedToday(completedToday);
    } catch (error) {
      console.error('Error checking quiz status:', error);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&difficulty=easy');
      const data = await response.json();
      
      if (data.response_code === 0) {
        const formattedQuestions: QuizQuestion[] = data.results.map((item: TriviaQuestion) => {
          const allAnswers = [...item.incorrect_answers, item.correct_answer];
          // Shuffle answers
          const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
          const correctIndex = shuffledAnswers.indexOf(item.correct_answer);
          
          return {
            question: decodeHtmlEntities(item.question),
            options: shuffledAnswers.map(answer => decodeHtmlEntities(answer)),
            correct: correctIndex
          };
        });
        setQuestions(formattedQuestions);
      } else {
        throw new Error('Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const decodeHtmlEntities = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const startQuiz = async () => {
    if (quizCompletedToday) {
      toast({
        title: "Quiz Already Completed",
        description: "You have already completed the quiz today. Come back tomorrow!",
        variant: "destructive",
      });
      return;
    }

    await fetchQuestions();
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

  const finishQuiz = async () => {
    setShowResult(true);
    const coinsEarned = score * 5; // 5 points per correct answer
    const scorePercentage = Math.round((score / questions.length) * 100);
    
    try {
      // Update coins
      await updateCoins(coinsEarned, 'quiz', `Daily quiz completed: ${score}/${questions.length} correct`);
      
      // Update quiz session in database
      const today = new Date().toISOString().split('T')[0];
      await supabase
        .from('quiz_sessions')
        .upsert({
          user_id: user?.id,
          last_quiz_date: today,
          questions_answered: questions.length,
          correct_answers: score,
          coins_earned: coinsEarned,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      setQuizCompletedToday(true);
      notifyQuizCompleted(scorePercentage, coinsEarned);
      
      toast({
        title: "🎉 Quiz Completed!",
        description: `You scored ${score}/${questions.length} and earned ${coinsEarned} points!`,
      });
    } catch (error) {
      console.error('Error updating quiz progress:', error);
      toast({
        title: "Quiz Completed!",
        description: `You scored ${score}/${questions.length}. There was an issue saving your progress.`,
        variant: "destructive",
      });
    }
  };

  if (quizCompletedToday && !quizStarted) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center text-white">
              <CheckCircle className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl">Quiz Completed Today!</CardTitle>
            <p className="text-gray-600">You've already completed today's quiz. Come back tomorrow for new questions!</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-100 p-4 rounded-lg border border-green-200 text-center">
              <p className="text-green-800 font-semibold">✅ Daily Quiz Task Completed</p>
              <p className="text-sm text-green-600 mt-1">Quiz resets every 24 hours</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white">
              <BookOpen className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl">Daily Quiz</CardTitle>
            <p className="text-gray-600">Test your knowledge and earn points!</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-blue-600">10</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-2xl font-bold text-green-600">50</p>
                <p className="text-sm text-gray-600">Max Points</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Quiz Rules:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 5 points per correct answer</li>
                <li>• 30 seconds per question</li>
                <li>• Questions from Open Trivia Database</li>
                <li>• Easy difficulty level</li>
                <li>• One quiz per day</li>
              </ul>
            </div>
            
            <Button 
              onClick={startQuiz}
              disabled={loading || quizCompletedToday}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-3"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              {loading ? 'Loading Questions...' : 'Start Quiz'}
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
              +{score * 5} Points Earned
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg text-center border">
              <p className="text-xl font-bold text-green-600">{Math.round((score / questions.length) * 100)}%</p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center border">
              <p className="text-xl font-bold text-blue-600">24h</p>
              <p className="text-sm text-gray-600">Next Quiz</p>
            </div>
          </div>
          
          <Button 
            onClick={() => {
              setQuizStarted(false);
              setShowResult(false);
            }}
            className="w-full"
            variant="outline"
          >
            Back to Quiz Menu
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz questions...</p>
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
            Score: {score}/{currentQuestion + (isAnswered ? 1 : 0)} • Potential: +{score * 5} points
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizSection;
