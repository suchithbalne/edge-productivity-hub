import React, { useState, useEffect } from 'react';
import { CloudSun, Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  minTemp: number;
  maxTemp: number;
  icon: React.ElementType;
}

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    location: 'Loading...',
    temperature: 0,
    condition: 'Loading...',
    humidity: 0,
    windSpeed: 0,
    minTemp: 0,
    maxTemp: 0,
    icon: CloudSun
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customLocation, setCustomLocation] = useState<string | null>(null);
  const [useCustomLocation, setUseCustomLocation] = useState(() => 
    localStorage.getItem('edge-homepage-use-custom-location') === 'true'
  );

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string): React.ElementType => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return Sun;
    if (conditionLower.includes('rain')) return CloudRain;
    if (conditionLower.includes('snow')) return Cloud; // Using Cloud as fallback for snow
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) return Cloud; // Using Cloud for fog
    if (conditionLower.includes('thunder') || conditionLower.includes('lightning')) return Cloud; // Using Cloud for lightning
    if (conditionLower.includes('cloud')) return CloudSun;
    return Cloud;
  };
  
  // Listen for weather location changes from settings
  useEffect(() => {
    const handleLocationChange = (e: CustomEvent) => {
      const { location, useCustomLocation: useCustomLoc } = e.detail;
      setCustomLocation(location);
      setUseCustomLocation(useCustomLoc);
      
      // Fetch weather with new location if custom location is enabled
      if (useCustomLoc && location) {
        fetchWeatherByCity(location);
      } else {
        // If custom location is disabled, use geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            (err) => {
              console.error('Geolocation error:', err);
              setError('Location access denied');
              useMockData();
            }
          );
        } else {
          setError('Geolocation not supported');
          useMockData();
        }
      }
    };
    
    window.addEventListener('weatherLocationChanged', handleLocationChange as EventListener);
    
    return () => {
      window.removeEventListener('weatherLocationChanged', handleLocationChange as EventListener);
    };
  }, []);

  // Function to fetch weather by coordinates
  const fetchWeatherByCoords = async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get API key from localStorage
      const apiKey = localStorage.getItem('edge-homepage-weather-api-key');
      
      if (!apiKey) {
        throw new Error('No API key provided');
      }
      
      // Using OpenWeatherMap API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Weather data could not be fetched: ${response.statusText}`);
      }
      
      const data = await response.json();
      processWeatherData(data);
      
      // Store the timestamp of the last update
      localStorage.setItem('edge-homepage-weather-last-update', Date.now().toString());
    } catch (err) {
      handleWeatherError(err);
    }
  };
  
  // Function to fetch weather by city name
  const fetchWeatherByCity = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get API key from localStorage
      const apiKey = localStorage.getItem('edge-homepage-weather-api-key');
      
      if (!apiKey) {
        throw new Error('No API key provided');
      }
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Weather data could not be fetched: ${response.statusText}`);
      }
      
      const data = await response.json();
      processWeatherData(data);
      
      // Store the timestamp of the last update
      localStorage.setItem('edge-homepage-weather-last-update', Date.now().toString());
    } catch (err) {
      handleWeatherError(err);
    }
  };
  
  // Process weather data from API response
  const processWeatherData = (data: any) => {
    const weatherData = {
      location: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      minTemp: Math.round(data.main.temp_min),
      maxTemp: Math.round(data.main.temp_max),
      icon: getWeatherIcon(data.weather[0].main)
    };
    
    setWeatherData(weatherData);
    
    // Save to localStorage for offline use
    localStorage.setItem('edge-homepage-weather', JSON.stringify({
      data: {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        minTemp: Math.round(data.main.temp_min),
        maxTemp: Math.round(data.main.temp_max)
      },
      timestamp: Date.now()
    }));
    
    setLoading(false);
  };
  
  // Handle errors when fetching weather data
  const handleWeatherError = (err: any) => {
    console.error('Error fetching weather data:', err);
    setError('Could not fetch weather data');
    setLoading(false);
    
    // Try to use cached data if available
    const cachedData = localStorage.getItem('edge-homepage-weather');
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        // Only use cached data if it's less than 3 hours old
        if (Date.now() - timestamp < 3 * 60 * 60 * 1000) {
          setWeatherData({
            ...data,
            icon: getWeatherIcon(data.condition)
          });
          setError(null);
        }
      } catch (e) {
        console.error('Error parsing cached weather data:', e);
      }
    }
  };

  // Use mock data if geolocation is not available or fails
  const useMockData = () => {
    const mockData = {
      location: 'New York',
      temperature: 19,
      condition: 'Partly Cloudy',
      humidity: 40,
      windSpeed: 5,
      minTemp: 15,
      maxTemp: 22,
      icon: CloudSun
    };
    setWeatherData(mockData);
    setLoading(false);
  };

  // Function to check if we should update the weather data
  const shouldUpdateWeather = () => {
    const lastUpdate = localStorage.getItem('edge-homepage-weather-last-update');
    if (!lastUpdate) return true;
    
    // Update if it's been more than an hour since the last update
    const hourInMs = 60 * 60 * 1000;
    return Date.now() - parseInt(lastUpdate) > hourInMs;
  };

  // Enhanced mock data function as fallback when API key is not available
  const getEnhancedMockData = (location = 'New York') => {
    // Generate slightly different values each time to simulate real updates
    const now = new Date();
    const hour = now.getHours();
    const baseTemp = hour < 6 ? 15 : hour < 12 ? 18 : hour < 18 ? 22 : 17; // Temperature varies by time of day
    
    // Add some randomness
    const randomFactor = Math.sin(Date.now() / 10000000) * 3;
    const temp = Math.round(baseTemp + randomFactor);
    
    // Determine condition based on temperature and time
    let condition = 'Partly Cloudy';
    if (temp > 25) condition = 'Sunny';
    else if (temp < 15) condition = 'Cloudy';
    else if (hour > 18 || hour < 6) condition = 'Clear Night';
    else if (Math.random() > 0.7) condition = 'Light Rain';
    
    return {
      location: location || 'New York',
      temperature: temp,
      condition: condition,
      humidity: Math.round(40 + randomFactor * 2),
      windSpeed: Math.round(5 + randomFactor),
      minTemp: Math.round(temp - 4 - Math.random() * 2),
      maxTemp: Math.round(temp + 4 + Math.random() * 2),
      icon: getWeatherIcon(condition)
    };
  };

  // Initial weather data fetch on component mount
  useEffect(() => {
    // Check if we should use custom location
    const savedUseCustomLocation = localStorage.getItem('edge-homepage-use-custom-location') === 'true';
    const savedLocation = localStorage.getItem('edge-homepage-weather-location');
    const apiKey = localStorage.getItem('edge-homepage-weather-api-key');
    
    const fetchWeather = () => {
      // If we have an API key, try to fetch real weather data
      if (apiKey) {
        if (savedUseCustomLocation && savedLocation) {
          // Use custom location if specified
          setCustomLocation(savedLocation);
          setUseCustomLocation(true);
          fetchWeatherByCity(savedLocation);
        } else {
          // Otherwise use geolocation
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
              },
              (err) => {
                console.error('Geolocation error:', err);
                setError('Location access denied');
                useMockData();
              }
            );
          } else {
            setError('Geolocation not supported');
            useMockData();
          }
        }
      } else {
        // If no API key, use mock data
        const locationToUse = (savedUseCustomLocation && savedLocation) ? savedLocation : 'New York';
        setCustomLocation(locationToUse);
        setUseCustomLocation(savedUseCustomLocation);
        setWeatherData(getEnhancedMockData(locationToUse));
        setLoading(false);
        setError('For accurate weather data, add an API key in Settings.');
      }
    };
    
    // Initial fetch
    fetchWeather();
    
    // Set up hourly updates
    const weatherUpdateInterval = setInterval(() => {
      if (shouldUpdateWeather()) {
        fetchWeather();
      }
    }, 15 * 60 * 1000); // Check every 15 minutes, but only update if an hour has passed
    
    return () => clearInterval(weatherUpdateInterval);
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-4 animate-pulse">
        <div className="h-6 bg-primary/20 rounded w-1/2 mb-2"></div>
        <div className="h-10 bg-primary/20 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-primary/20 rounded w-2/3"></div>
      </div>
    );
  }

  const WeatherIcon = weatherData.icon;

  return (
    <div className="glass-card p-4">
      {error ? (
        <div className="text-center text-primary/80 p-2">
          <p>{error}</p>
        </div>
      ) : null}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <WeatherIcon className="w-8 h-8 text-primary" />
          <div className="ml-3">
            <div className="text-lg font-semibold">{weatherData.condition}</div>
            <div className="text-sm text-muted-foreground">{weatherData.location}</div>
          </div>
        </div>
        <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <div className="flex items-center">
          <Droplets className="w-4 h-4 mr-1 text-primary" />
          <span className="text-sm">Humidity {weatherData.humidity}%</span>
        </div>
        <div className="flex items-center">
          <Wind className="w-4 h-4 mr-1 text-primary" />
          <span className="text-sm">{weatherData.windSpeed} km/h</span>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-center text-muted-foreground">
        {weatherData.minTemp}°C - {weatherData.maxTemp}°C
      </div>
    </div>
  );
};

export default WeatherWidget;
