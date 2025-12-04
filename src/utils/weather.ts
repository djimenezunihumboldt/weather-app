import type { TemperatureUnit, WeatherTheme, DailyForecast, ForecastItem } from '../types';
import { format, fromUnixTime, isToday, isTomorrow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

/**
 * Convert temperature between units
 */
export const convertTemperature = (
  temp: number,
  unit: TemperatureUnit
): number => {
  if (unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32);
  }
  return Math.round(temp);
};

/**
 * Format temperature with unit symbol
 */
export const formatTemperature = (
  temp: number,
  unit: TemperatureUnit
): string => {
  const converted = convertTemperature(temp, unit);
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${converted}${symbol}`;
};

/**
 * Get weather theme based on conditions
 */
export const getWeatherTheme = (
  weatherId: number,
  isNight: boolean
): WeatherTheme => {
  // Thunderstorm (200-299)
  if (weatherId >= 200 && weatherId < 300) {
    return 'stormy';
  }
  // Drizzle (300-399) or Rain (500-599)
  if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    return 'rainy';
  }
  // Snow (600-699)
  if (weatherId >= 600 && weatherId < 700) {
    return 'snowy';
  }
  // Atmosphere (700-799) - fog, mist, etc.
  if (weatherId >= 700 && weatherId < 800) {
    return 'foggy';
  }
  // Clear (800)
  if (weatherId === 800) {
    return isNight ? 'clear-night' : 'clear-day';
  }
  // Clouds (801-804)
  return 'cloudy';
};

/**
 * Get gradient class based on weather theme
 */
export const getThemeGradient = (theme: WeatherTheme): string => {
  const gradients: Record<WeatherTheme, string> = {
    'clear-day': 'from-sky-400 via-blue-500 to-indigo-600',
    'clear-night': 'from-slate-900 via-indigo-950 to-purple-950',
    'cloudy': 'from-slate-400 via-gray-500 to-slate-600',
    'rainy': 'from-slate-600 via-blue-800 to-slate-900',
    'snowy': 'from-slate-200 via-blue-200 to-indigo-300',
    'stormy': 'from-slate-800 via-purple-900 to-slate-900',
    'foggy': 'from-gray-400 via-slate-500 to-gray-600',
  };
  return gradients[theme];
};

/**
 * Check if it's night time based on sunrise/sunset
 */
export const isNightTime = (
  currentTime: number,
  sunrise: number,
  sunset: number
): boolean => {
  return currentTime < sunrise || currentTime > sunset;
};

/**
 * Format date for display
 */
export const formatDate = (
  timestamp: number,
  formatStr: string,
  language: 'es' | 'en' = 'es'
): string => {
  const date = fromUnixTime(timestamp);
  const locale = language === 'es' ? es : enUS;
  return format(date, formatStr, { locale });
};

/**
 * Get day name (Today, Tomorrow, or day name)
 */
export const getDayName = (
  timestamp: number,
  language: 'es' | 'en' = 'es'
): string => {
  const date = fromUnixTime(timestamp);
  const locale = language === 'es' ? es : enUS;

  if (isToday(date)) {
    return language === 'es' ? 'Hoy' : 'Today';
  }
  if (isTomorrow(date)) {
    return language === 'es' ? 'Mañana' : 'Tomorrow';
  }
  return format(date, 'EEEE', { locale });
};

/**
 * Process forecast data into daily summaries
 */
export const processDailyForecast = (
  forecastItems: ForecastItem[]
): DailyForecast[] => {
  const dailyMap = new Map<string, ForecastItem[]>();

  // Group by day
  forecastItems.forEach((item) => {
    const date = format(fromUnixTime(item.dt), 'yyyy-MM-dd');
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });

  // Process each day
  const dailyForecasts: DailyForecast[] = [];

  dailyMap.forEach((items, dateStr) => {
    const temps = items.map((i) => i.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    // Get most common weather condition (around noon if available)
    const noonItem = items.find((i) => i.dt_txt.includes('12:00:00')) || items[Math.floor(items.length / 2)];

    // Calculate average humidity and wind
    const avgHumidity = Math.round(items.reduce((sum, i) => sum + i.main.humidity, 0) / items.length);
    const avgWind = Math.round(items.reduce((sum, i) => sum + i.wind.speed, 0) / items.length);

    // Get max probability of precipitation
    const maxPop = Math.max(...items.map((i) => i.pop));

    dailyForecasts.push({
      date: new Date(dateStr),
      tempMin: minTemp,
      tempMax: maxTemp,
      icon: noonItem.weather[0].icon,
      description: noonItem.weather[0].description,
      humidity: avgHumidity,
      windSpeed: avgWind,
      pop: maxPop,
    });
  });

  return dailyForecasts.slice(0, 5); // Return only 5 days
};

/**
 * Get wind direction from degrees
 */
export const getWindDirection = (deg: number, language: 'es' | 'en' = 'es'): string => {
  const directions = language === 'es' 
    ? ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
    : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

/**
 * Get UV Index description
 */
export const getUVDescription = (uvi: number, language: 'es' | 'en' = 'es'): string => {
  const descriptions = {
    es: ['Bajo', 'Moderado', 'Alto', 'Muy Alto', 'Extremo'],
    en: ['Low', 'Moderate', 'High', 'Very High', 'Extreme'],
  };

  const desc = descriptions[language];

  if (uvi < 3) return desc[0];
  if (uvi < 6) return desc[1];
  if (uvi < 8) return desc[2];
  if (uvi < 11) return desc[3];
  return desc[4];
};

/**
 * Format visibility in km
 */
export const formatVisibility = (meters: number): string => {
  const km = meters / 1000;
  return km >= 10 ? '10+ km' : `${km.toFixed(1)} km`;
};

/**
 * Get temperature color class
 */
export const getTempColorClass = (temp: number): string => {
  if (temp <= 0) return 'text-cyan-300';
  if (temp <= 10) return 'text-blue-300';
  if (temp <= 20) return 'text-green-300';
  if (temp <= 30) return 'text-yellow-300';
  if (temp <= 40) return 'text-orange-400';
  return 'text-red-500';
};

/**
 * Get weather icon URL
 */
export const getWeatherIconUrl = (
  iconCode: string,
  size: '2x' | '4x' = '2x'
): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

/**
 * Format time from unix timestamp with timezone
 */
export const formatTime = (
  timestamp: number,
  timezone: number,
  language: 'es' | 'en' = 'es'
): string => {
  const date = new Date((timestamp + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
  if (language === 'en') {
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

/**
 * Format hour from unix timestamp
 */
export const formatHour = (
  timestamp: number,
  language: 'es' | 'en' = 'es'
): string => {
  const date = fromUnixTime(timestamp);
  const locale = language === 'es' ? es : enUS;
  return format(date, 'HH:mm', { locale });
};

/**
 * Map weather condition to simple condition type
 */
export const mapWeatherCondition = (
  weatherMain: string
): 'clear' | 'clouds' | 'rain' | 'drizzle' | 'thunderstorm' | 'snow' | 'mist' | 'fog' | 'haze' | 'dust' | 'smoke' => {
  const condition = weatherMain.toLowerCase();
  
  switch (condition) {
    case 'clear':
      return 'clear';
    case 'clouds':
      return 'clouds';
    case 'rain':
      return 'rain';
    case 'drizzle':
      return 'drizzle';
    case 'thunderstorm':
      return 'thunderstorm';
    case 'snow':
      return 'snow';
    case 'mist':
      return 'mist';
    case 'fog':
      return 'fog';
    case 'haze':
      return 'haze';
    case 'dust':
    case 'sand':
    case 'ash':
      return 'dust';
    case 'smoke':
      return 'smoke';
    default:
      return 'clear';
  }
};
