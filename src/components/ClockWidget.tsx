
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="glass-card p-6 text-center animate-fade-in">
      <div className="flex items-center justify-center mb-2">
        <Clock className="w-6 h-6 text-primary mr-2" />
        <span className="text-sm text-muted-foreground">Current Time</span>
      </div>
      <div className="text-4xl font-bold mb-2">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-lg text-muted-foreground mb-1">
        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div className="text-primary font-medium">
        {getGreeting()}! Ready to be productive?
      </div>
    </div>
  );
};

export default ClockWidget;
