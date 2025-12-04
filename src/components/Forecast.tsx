import { motion } from 'framer-motion';
import { Droplets, Wind } from 'lucide-react';
import type { ForecastData } from '../types';
import { useWeatherStore } from '../store';
import { 
  formatTemperature, 
  getDayName, 
  processDailyForecast,
  getWeatherEmoji 
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
      className="mt-6 sm:mt-8 w-full"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
        Pronóstico de 5 días
      </h2>

      {/* Mobile: Horizontal scroll | Desktop: Grid */}
      <div className="block sm:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
          {dailyForecasts.map((day, index) => (
            <motion.div
              key={day.date.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex-shrink-0 glass rounded-xl p-3 min-w-[120px] text-center snap-start"
            >
              <p className="text-white font-medium capitalize text-sm mb-1">
                {getDayName(day.date.getTime() / 1000, language)}
              </p>

              <span className="text-3xl block mx-auto my-1">
                {getWeatherEmoji(day.icon)}
              </span>

              <div className="flex items-center justify-center gap-1 text-sm mb-1">
                <span className="text-white font-semibold">
                  {formatTemperature(day.tempMax, temperatureUnit)}
                </span>
                <span className="text-white/50 text-xs">
                  {formatTemperature(day.tempMin, temperatureUnit)}
                </span>
              </div>

              <p className="text-white/60 text-xs capitalize line-clamp-1 mb-2">
                {day.description}
              </p>

              <div className="flex items-center justify-center gap-2 text-xs text-white/50">
                <div className="flex items-center gap-0.5">
                  <Droplets className="w-3 h-3" />
                  <span>{day.humidity}%</span>
                </div>
              </div>

              {day.pop > 0 && (
                <div className="mt-1 text-xs text-blue-300">
                  💧 {Math.round(day.pop * 100)}%
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
        {dailyForecasts.map((day, index) => (
          <motion.div
            key={day.date.toISOString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass rounded-2xl p-3 sm:p-4 text-center cursor-pointer transition-all"
          >
            <p className="text-white font-medium capitalize mb-2 text-sm sm:text-base">
              {getDayName(day.date.getTime() / 1000, language)}
            </p>

            <span className="text-4xl sm:text-5xl block mx-auto my-2">
              {getWeatherEmoji(day.icon)}
            </span>

            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-white font-semibold text-sm sm:text-base">
                {formatTemperature(day.tempMax, temperatureUnit)}
              </span>
              <span className="text-white/50 text-xs sm:text-sm">
                {formatTemperature(day.tempMin, temperatureUnit)}
              </span>
            </div>

            <p className="text-white/60 text-xs sm:text-sm capitalize mb-2 sm:mb-3 line-clamp-1">
              {day.description}
            </p>

            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs text-white/50">
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                <span>{day.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                <span>{Math.round(day.windSpeed * 3.6)}</span>
              </div>
            </div>

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
