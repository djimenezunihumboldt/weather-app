import { motion } from 'framer-motion';
import type { ForecastItem } from '../types';
import { useWeatherStore } from '../store';
import { formatTemperature, formatHour, getWeatherIconUrl } from '../utils';

interface HourlyForecastProps {
  data: ForecastItem[];
}

export const HourlyForecast = ({ data }: HourlyForecastProps) => {
  const { settings } = useWeatherStore();
  const { temperatureUnit, language } = settings;

  // Get next 24 hours (8 items since data is every 3 hours)
  const hourlyData = data.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-6"
    >
      <h3 className="text-lg font-medium text-white mb-4">
        Próximas 24 horas
      </h3>

      <div className="relative">
        {/* Scroll Container */}
        <div 
          className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          style={{ scrollbarWidth: 'thin' }}
        >
          {hourlyData.map((item, index) => (
            <motion.div
              key={item.dt}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 glass rounded-xl p-3 min-w-[80px] text-center cursor-pointer transition-all"
            >
              {/* Hour */}
              <p className="text-white/60 text-sm mb-2">
                {index === 0 ? 'Ahora' : formatHour(item.dt, language)}
              </p>

              {/* Weather Icon */}
              <img
                src={getWeatherIconUrl(item.weather[0].icon, '2x')}
                alt={item.weather[0].description}
                className="w-12 h-12 mx-auto"
              />

              {/* Temperature */}
              <p className="text-white font-semibold mt-1">
                {formatTemperature(item.main.temp, temperatureUnit)}
              </p>

              {/* Precipitation Probability */}
              {item.pop > 0 && (
                <p className="text-blue-300 text-xs mt-1">
                  💧 {Math.round(item.pop * 100)}%
                </p>
              )}

              {/* Wind Speed */}
              <p className="text-white/40 text-xs mt-1">
                🌬️ {Math.round(item.wind.speed * 3.6)} km/h
              </p>
            </motion.div>
          ))}
        </div>

        {/* Gradient Fade Effect */}
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-black/30 to-transparent pointer-events-none rounded-r-xl" />
      </div>
    </motion.div>
  );
};
