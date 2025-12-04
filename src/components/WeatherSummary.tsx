import { motion } from 'framer-motion';
import { 
  Umbrella, 
  Wind, 
  Droplets, 
  Sun, 
  Snowflake,
  ThermometerSun,
  Eye
} from 'lucide-react';
import type { WeatherData, ForecastData } from '../types';
import { useWeatherStore } from '../store';
import { formatTemperature, processDailyForecast } from '../utils';

interface WeatherSummaryProps {
  weatherData: WeatherData;
  forecastData: ForecastData | null;
}

export const WeatherSummary = ({ weatherData, forecastData }: WeatherSummaryProps) => {
  const { settings } = useWeatherStore();
  const { temperatureUnit } = settings;

  // Get today's forecast summary
  const dailyForecasts = forecastData ? processDailyForecast(forecastData.list) : [];
  const todayForecast = dailyForecasts[0];

  // Determine weather advice
  const getWeatherAdvice = () => {
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed * 3.6; // Convert to km/h
    const weatherMain = weatherData.weather[0].main.toLowerCase();
    const pop = todayForecast?.pop || 0;

    const advice: Array<{ icon: typeof Sun; text: string; color: string }> = [];

    // Rain probability
    if (pop > 0.3 || weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
      advice.push({
        icon: Umbrella,
        text: `${Math.round(pop * 100)}% probabilidad de lluvia. Lleva paraguas`,
        color: 'text-blue-400',
      });
    }

    // Temperature advice
    if (temp > 30) {
      advice.push({
        icon: ThermometerSun,
        text: 'Día caluroso. Mantente hidratado',
        color: 'text-orange-400',
      });
    } else if (temp < 10) {
      advice.push({
        icon: Snowflake,
        text: 'Día frío. Abrígate bien',
        color: 'text-cyan-400',
      });
    }

    // Wind advice
    if (windSpeed > 30) {
      advice.push({
        icon: Wind,
        text: 'Vientos fuertes. Ten precaución',
        color: 'text-teal-400',
      });
    }

    // Humidity advice
    if (humidity > 80) {
      advice.push({
        icon: Droplets,
        text: 'Alta humedad. Puede sentirse bochornoso',
        color: 'text-blue-300',
      });
    }

    // Visibility advice
    if (weatherData.visibility < 5000) {
      advice.push({
        icon: Eye,
        text: 'Visibilidad reducida. Conduce con cuidado',
        color: 'text-gray-400',
      });
    }

    // Good weather
    if (advice.length === 0) {
      advice.push({
        icon: Sun,
        text: '¡Buen día para actividades al aire libre!',
        color: 'text-yellow-400',
      });
    }

    return advice;
  };

  const advice = getWeatherAdvice();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mt-6 w-full"
    >
      <div className="glass rounded-2xl p-4 sm:p-5">
        <h3 className="text-sm font-medium text-white/70 mb-3">
          Resumen del día
        </h3>

        <div className="space-y-3">
          {advice.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className={`p-2 rounded-lg bg-white/10 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-white/80 text-sm">{item.text}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Today's Min/Max if available */}
        {todayForecast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-sm"
          >
            <span className="text-white/60">Rango de hoy</span>
            <div className="flex items-center gap-2">
              <span className="text-blue-300">
                ↓ {formatTemperature(todayForecast.tempMin, temperatureUnit)}
              </span>
              <span className="text-white/30">|</span>
              <span className="text-orange-300">
                ↑ {formatTemperature(todayForecast.tempMax, temperatureUnit)}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
