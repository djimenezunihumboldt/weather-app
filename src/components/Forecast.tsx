import { motion } from 'framer-motion';
import { Droplets, Wind } from 'lucide-react';
import type { ForecastData } from '../types';
import { useWeatherStore } from '../store';
import { 
  formatTemperature, 
  getDayName, 
  processDailyForecast,
  getWeatherIconUrl 
} from '../utils';

interface ForecastProps {
  data: ForecastData;
}

export const Forecast = ({ data }: ForecastProps) => {
  const { settings } = useWeatherStore();
  const { temperatureUnit, language } = settings;

  const dailyForecasts = processDailyForecast(data.list);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8"
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        Pronóstico de 5 días
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {dailyForecasts.map((day, index) => (
          <motion.div
            key={day.date.toISOString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass rounded-2xl p-4 text-center cursor-pointer transition-all"
          >
            {/* Day Name */}
            <p className="text-white font-medium capitalize mb-2">
              {getDayName(day.date.getTime() / 1000, language)}
            </p>

            {/* Weather Icon */}
            <img
              src={getWeatherIconUrl(day.icon, '2x')}
              alt={day.description}
              className="w-16 h-16 mx-auto"
            />

            {/* Temperature Range */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-white font-semibold">
                {formatTemperature(day.tempMax, temperatureUnit)}
              </span>
              <span className="text-white/50">
                {formatTemperature(day.tempMin, temperatureUnit)}
              </span>
            </div>

            {/* Description */}
            <p className="text-white/60 text-sm capitalize mb-3 line-clamp-1">
              {day.description}
            </p>

            {/* Additional Info */}
            <div className="flex items-center justify-center gap-3 text-xs text-white/50">
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                <span>{day.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                <span>{Math.round(day.windSpeed * 3.6)}</span>
              </div>
            </div>

            {/* Precipitation Probability */}
            {day.pop > 0 && (
              <div className="mt-2 text-xs text-blue-300">
                💧 {Math.round(day.pop * 100)}% prob. lluvia
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
