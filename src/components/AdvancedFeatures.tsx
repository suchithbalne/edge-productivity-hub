import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Target, 
  Calendar, 
  BarChart, 
  Focus, 
  CheckSquare, 
  Bookmark, 
  Activity, 
  Quote 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdvancedFeaturesProps {
  isVisible: boolean;
}

const AdvancedFeatures = ({ isVisible }: AdvancedFeaturesProps) => {
  const [activeTab, setActiveTab] = useState('pomodoro');
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(pomodoroMinutes * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [dailyGoals, setDailyGoals] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('edge-homepage-daily-goals');
      return saved ? JSON.parse(saved) : ['', '', ''];
    } catch (e) {
      return ['', '', ''];
    }
  });
  const [goalProgress, setGoalProgress] = useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem('edge-homepage-goal-progress');
      return saved ? JSON.parse(saved) : [false, false, false];
    } catch (e) {
      return [false, false, false];
    }
  });
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [focusDuration, setFocusDuration] = useState(30);
  const [focusTimeLeft, setFocusTimeLeft] = useState(0);
  const [quote, setQuote] = useState(() => {
    const quotes = [
      "The secret of getting ahead is getting started. - Mark Twain",
      "It always seems impossible until it's done. - Nelson Mandela",
      "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
      "The way to get started is to quit talking and begin doing. - Walt Disney",
      "You don't have to be great to start, but you have to start to be great. - Zig Ziglar"
    ];
    const savedQuote = localStorage.getItem('edge-homepage-current-quote');
    return savedQuote || quotes[Math.floor(Math.random() * quotes.length)];
  });
  
  // No notes feature anymore
  
  // Save goals when they change
  useEffect(() => {
    localStorage.setItem('edge-homepage-daily-goals', JSON.stringify(dailyGoals));
  }, [dailyGoals]);
  
  // Save goal progress when it changes
  useEffect(() => {
    localStorage.setItem('edge-homepage-goal-progress', JSON.stringify(goalProgress));
  }, [goalProgress]);
  
  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Play notification sound
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
      audio.play();
      
      // Switch between pomodoro and break
      if (isBreak) {
        setIsBreak(false);
        setTimeLeft(pomodoroMinutes * 60);
      } else {
        setIsBreak(true);
        setTimeLeft(breakMinutes * 60);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak, pomodoroMinutes, breakMinutes]);
  
  // Focus mode timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (focusModeActive && focusTimeLeft > 0) {
      interval = setInterval(() => {
        setFocusTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (focusModeActive && focusTimeLeft === 0) {
      setFocusModeActive(false);
      // Play notification sound
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3');
      audio.play();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusModeActive, focusTimeLeft]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start/pause pomodoro timer
  const toggleTimer = () => {
    if (!isRunning && timeLeft === 0) {
      // If timer is finished, reset it
      setTimeLeft(pomodoroMinutes * 60);
      setIsBreak(false);
    }
    setIsRunning(!isRunning);
  };
  
  // Reset pomodoro timer
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(pomodoroMinutes * 60);
  };
  
  // Update pomodoro settings
  const updatePomodoroSettings = () => {
    setIsRunning(false);
    setTimeLeft(pomodoroMinutes * 60);
    setIsBreak(false);
  };
  
  // Toggle goal completion
  const toggleGoalCompletion = (index: number) => {
    const newProgress = [...goalProgress];
    newProgress[index] = !newProgress[index];
    setGoalProgress(newProgress);
  };
  
  // Update goal text
  const updateGoal = (index: number, text: string) => {
    const newGoals = [...dailyGoals];
    newGoals[index] = text;
    setDailyGoals(newGoals);
  };
  
  // Start focus mode
  const startFocusMode = () => {
    setFocusModeActive(true);
    setFocusTimeLeft(focusDuration * 60);
    
    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    
    // Create a notification
    if (Notification.permission === 'granted') {
      new Notification('Focus Mode Activated', {
        body: `You're now in focus mode for ${focusDuration} minutes. Stay focused!`,
        icon: '/icons/icon.svg'
      });
    }
  };
  
  // End focus mode
  const endFocusMode = () => {
    setFocusModeActive(false);
  };
  
  // Generate new quote
  const generateNewQuote = () => {
    const quotes = [
      "The secret of getting ahead is getting started. - Mark Twain",
      "It always seems impossible until it's done. - Nelson Mandela",
      "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
      "The way to get started is to quit talking and begin doing. - Walt Disney",
      "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
      "Believe you can and you're halfway there. - Theodore Roosevelt",
      "Quality is not an act, it is a habit. - Aristotle",
      "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
      "The only way to do great work is to love what you do. - Steve Jobs",
      "Your time is limited, don't waste it living someone else's life. - Steve Jobs"
    ];
    
    let newQuote = quote;
    while (newQuote === quote) {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }
    
    setQuote(newQuote);
    localStorage.setItem('edge-homepage-current-quote', newQuote);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="glass-card p-4 mt-4 w-full max-w-3xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="pomodoro" className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Pomodoro</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center">
            <Target className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Goals</span>
          </TabsTrigger>
          <TabsTrigger value="focus" className="flex items-center">
            <Focus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Focus</span>
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center">
            <Quote className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Quotes</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pomodoro" className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              {isBreak ? 'Break Time' : 'Focus Time'}
            </h3>
            <div className="text-4xl font-mono font-bold mb-4">
              {formatTime(timeLeft)}
            </div>
            <div className="flex justify-center space-x-2">
              <Button onClick={toggleTimer} variant={isRunning ? "destructive" : "default"}>
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button onClick={resetTimer} variant="outline">Reset</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium">Work Minutes</label>
              <div className="flex items-center mt-1">
                <Input 
                  type="number" 
                  min="1" 
                  max="60"
                  value={pomodoroMinutes}
                  onChange={(e) => setPomodoroMinutes(parseInt(e.target.value) || 25)}
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Break Minutes</label>
              <div className="flex items-center mt-1">
                <Input 
                  type="number" 
                  min="1" 
                  max="30"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(parseInt(e.target.value) || 5)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <Button onClick={updatePomodoroSettings} variant="outline" className="w-full">
            Apply Settings
          </Button>
        </TabsContent>
        
        {/* Notes feature has been removed */}
        
        <TabsContent value="goals" className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Daily Focus Goals</h3>
          <div className="space-y-3">
            {dailyGoals.map((goal, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Button
                  variant={goalProgress[index] ? "default" : "outline"}
                  size="icon"
                  className="w-6 h-6 rounded-md flex-shrink-0"
                  onClick={() => toggleGoalCompletion(index)}
                >
                  {goalProgress[index] && <CheckSquare className="w-4 h-4" />}
                </Button>
                <Input
                  value={goal}
                  onChange={(e) => updateGoal(index, e.target.value)}
                  placeholder={`Goal ${index + 1}`}
                  className={goalProgress[index] ? "line-through opacity-50" : ""}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Set up to 3 main goals for your day. Click the checkbox when complete.
          </p>
        </TabsContent>
        
        <TabsContent value="focus" className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Focus Mode</h3>
          
          {focusModeActive ? (
            <div className="text-center">
              <div className="text-4xl font-mono font-bold mb-4">
                {formatTime(focusTimeLeft)}
              </div>
              <p className="mb-4">Focus mode active. Stay concentrated on your task!</p>
              <Button onClick={endFocusMode} variant="destructive">
                End Focus Mode
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Focus Duration (minutes)</label>
                <Input 
                  type="number" 
                  min="5" 
                  max="120"
                  value={focusDuration}
                  onChange={(e) => setFocusDuration(parseInt(e.target.value) || 30)}
                  className="w-full mt-1"
                />
              </div>
              <Button onClick={startFocusMode} variant="default" className="w-full">
                Start Focus Mode
              </Button>
              <p className="text-xs text-muted-foreground">
                Focus mode helps you concentrate on your work by minimizing distractions.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quotes" className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Inspirational Quote</h3>
          <div className="p-6 bg-white/5 rounded-lg border border-white/10">
            <blockquote className="italic text-lg">"{quote.split(' - ')[0]}"</blockquote>
            <p className="text-right mt-2 text-primary">- {quote.split(' - ')[1]}</p>
          </div>
          <Button onClick={generateNewQuote} variant="outline" className="w-full">
            Generate New Quote
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedFeatures;
