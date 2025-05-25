import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from './ui/button';

interface ModernClockProps {
  clockStyle: 'digital' | 'analog';
  // toggleClockStyle removed as it will be managed from settings only
}

const ModernClock: React.FC<ModernClockProps> = ({ clockStyle }) => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(() => {
    return localStorage.getItem('edge-homepage-24hour-clock') === 'true';
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Listen for clock format changes
  useEffect(() => {
    const handleClockFormatChange = (e: CustomEvent) => {
      setIs24Hour(e.detail.is24Hour);
    };
    
    window.addEventListener('clockFormatChanged', handleClockFormatChange as EventListener);
    
    return () => {
      window.removeEventListener('clockFormatChanged', handleClockFormatChange as EventListener);
    };
  }, []);

  // Add blinking effect for the separator
  const [separatorVisible, setSeparatorVisible] = useState(true);
  
  useEffect(() => {
    // Toggle the separator visibility every 500ms
    const blinkInterval = setInterval(() => {
      setSeparatorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(blinkInterval);
  }, []);

  const renderDigitalClock = () => {
    const hours = format(time, is24Hour ? 'HH' : 'hh');
    const minutes = format(time, 'mm');
    const seconds = format(time, 'ss');
    const ampm = format(time, 'a');
    
    return (
      <div className="text-center">
        <div className="text-5xl font-bold tracking-tight text-primary">
          {hours}
          <span className={separatorVisible ? 'opacity-100' : 'opacity-0'}>:</span>
          {minutes}
          <span className={separatorVisible ? 'opacity-100' : 'opacity-0'}>:</span>
          {seconds}
          {!is24Hour && <span className="ml-2">{ampm}</span>}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {format(time, 'EEEE, MMMM d, yyyy')}
        </div>
      </div>
    );
  };

  const renderAnalogClock = () => {
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours() % 12;

    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
    const hourDegrees = ((hours + minutes / 60) / 12) * 360;

    return (
      <div className="text-center">
        <div className="relative w-48 h-48 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 bg-background/50 backdrop-blur-sm shadow-lg"></div>
          
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => {
            const angle = i * 30;
            const radians = (angle * Math.PI) / 180;
            const x = 24 * Math.sin(radians);
            const y = -24 * Math.cos(radians);
            return (
              <div 
                key={i} 
                className="absolute bg-primary/60" 
                style={{ 
                  width: i % 3 === 0 ? '2px' : '1px',
                  height: i % 3 === 0 ? '8px' : '5px',
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  transformOrigin: 'center'
                }}
              ></div>
            );
          })}
          
          {/* Hour hand */}
          <div 
            className="absolute left-1/2 top-1/2 w-1.5 bg-primary rounded-full shadow-md"
            style={{ 
              height: '30%', 
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)`
            }}
          ></div>
          
          {/* Minute hand */}
          <div 
            className="absolute left-1/2 top-1/2 w-1 bg-primary/80 rounded-full shadow-md"
            style={{ 
              height: '40%', 
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)`
            }}
          ></div>
          
          {/* Second hand */}
          <div 
            className="absolute left-1/2 top-1/2 w-0.5 bg-primary/60 rounded-full shadow-sm"
            style={{ 
              height: '45%', 
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)`
            }}
          ></div>
          
          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="text-sm text-muted-foreground">
          {format(time, 'EEEE, MMMM d, yyyy')}
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card p-6 backdrop-blur-md">
      {clockStyle === 'digital' ? renderDigitalClock() : renderAnalogClock()}
    </div>
  );
};

export default ModernClock;
