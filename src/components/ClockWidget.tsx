
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  const [isDigital, setIsDigital] = useState(() => 
    localStorage.getItem('edge-homepage-digital-clock') !== 'false'
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const handleClockTypeChange = (event: CustomEvent) => {
      setIsDigital(event.detail.isDigital);
    };

    window.addEventListener('clockTypeChanged', handleClockTypeChange as EventListener);

    return () => {
      clearInterval(timer);
      window.removeEventListener('clockTypeChanged', handleClockTypeChange as EventListener);
    };
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const AnalogClock = () => {
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourAngle = (hours * 30) + (minutes * 0.5);
    const minuteAngle = minutes * 6;
    const secondAngle = seconds * 6;

    return (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-primary/30 bg-white/5"></div>
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-6 bg-primary/60 rounded"
            style={{
              top: '8px',
              left: '50%',
              transformOrigin: '50% 56px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`
            }}
          />
        ))}
        {/* Hour hand */}
        <div
          className="absolute w-1 h-10 bg-primary rounded-full"
          style={{
            top: '26px',
            left: '50%',
            transformOrigin: '50% 38px',
            transform: `translateX(-50%) rotate(${hourAngle}deg)`
          }}
        />
        {/* Minute hand */}
        <div
          className="absolute w-0.5 h-12 bg-primary rounded-full"
          style={{
            top: '18px',
            left: '50%',
            transformOrigin: '50% 46px',
            transform: `translateX(-50%) rotate(${minuteAngle}deg)`
          }}
        />
        {/* Second hand */}
        <div
          className="absolute w-0.5 h-14 bg-red-500 rounded-full"
          style={{
            top: '10px',
            left: '50%',
            transformOrigin: '50% 54px',
            transform: `translateX(-50%) rotate(${secondAngle}deg)`
          }}
        />
        {/* Center dot */}
        <div className="absolute w-3 h-3 bg-primary rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    );
  };

  return (
    <div className="glass-card p-6 text-center animate-fade-in">
      <div className="flex items-center justify-center mb-2">
        <Clock className="w-6 h-6 text-primary mr-2" />
        <span className="text-sm text-muted-foreground">Current Time</span>
      </div>
      
      {isDigital ? (
        <div className="text-4xl font-bold mb-2">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      ) : (
        <AnalogClock />
      )}
      
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
