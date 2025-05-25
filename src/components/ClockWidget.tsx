
import React, { useState, useEffect } from 'react';

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  const [isDigital, setIsDigital] = useState(() => 
    localStorage.getItem('edge-homepage-digital-clock') !== 'false'
  );
  const [userName, setUserName] = useState(() => 
    localStorage.getItem('edge-homepage-username') || 'User'
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const handleClockTypeChange = (event: CustomEvent) => {
      setIsDigital(event.detail.isDigital);
    };

    const handleUserNameChange = (event: CustomEvent) => {
      setUserName(event.detail.userName);
    };

    window.addEventListener('clockTypeChanged', handleClockTypeChange as EventListener);
    window.addEventListener('userNameChanged', handleUserNameChange as EventListener);

    return () => {
      clearInterval(timer);
      window.removeEventListener('clockTypeChanged', handleClockTypeChange as EventListener);
      window.removeEventListener('userNameChanged', handleUserNameChange as EventListener);
    };
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatTime = () => {
    if (isDigital) {
      return time.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    }
    return time.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDate = () => {
    return time.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isDigital) {
    // Analog Clock
    const secondAngle = (time.getSeconds() * 6) - 90;
    const minuteAngle = (time.getMinutes() * 6) - 90;
    const hourAngle = ((time.getHours() % 12) * 30 + time.getMinutes() * 0.5) - 90;

    return (
      <div className="text-center">
        <h1 className="text-4xl font-light mb-2 text-primary">
          {getGreeting()}, {userName}!
        </h1>
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Clock face */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/20"
              />
              
              {/* Hour markers */}
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="10"
                  x2="50"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
              
              {/* Hour hand */}
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="25"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-primary"
                transform={`rotate(${hourAngle} 50 50)`}
              />
              
              {/* Minute hand */}
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary"
                transform={`rotate(${minuteAngle} 50 50)`}
              />
              
              {/* Second hand */}
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="15"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                className="text-red-500"
                transform={`rotate(${secondAngle} 50 50)`}
              />
              
              {/* Center dot */}
              <circle
                cx="50"
                cy="50"
                r="2"
                fill="currentColor"
                className="text-primary"
              />
            </svg>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">{formatDate()}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-light mb-4 text-primary">
        {getGreeting()}, {userName}!
      </h1>
      <div className="text-6xl font-mono mb-2 text-primary glow-effect">
        {formatTime()}
      </div>
      <p className="text-lg text-muted-foreground">{formatDate()}</p>
    </div>
  );
};

export default ClockWidget;
