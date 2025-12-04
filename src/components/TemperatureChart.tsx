import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ForecastItem } from '../types';
import { useWeatherStore } from '../store';
import { formatTemperature, formatHour } from '../utils';

interface TemperatureChartProps {
  data: ForecastItem[];
}

export const TemperatureChart = ({ data }: TemperatureChartProps) => {
  const { settings } = useWeatherStore();
  const { temperatureUnit, language } = settings;

  // Get next 8 data points (24 hours)
  const chartData = data.slice(0, 8);
  
  // Calculate min and max for scaling
  const temps = chartData.map(item => item.main.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;

  // Calculate trend
  const firstTemp = temps[0];
  const lastTemp = temps[temps.length - 1];
  const trend = lastTemp - firstTemp;
  const TrendIcon = trend > 1 ? TrendingUp : trend < -1 ? TrendingDown : Minus;
  const trendColor = trend > 1 ? 'text-red-400' : trend < -1 ? 'text-blue-400' : 'text-white/60';
  const trendText = trend > 1 ? 'Subiendo' : trend < -1 ? 'Bajando' : 'Estable';

  // Generate SVG path
  const width = 100;
  const height = 40;
  const padding = 5;
  
  const points = chartData.map((item, index) => {
    const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((item.main.temp - minTemp) / tempRange) * (height - 2 * padding);
    return { x, y, temp: item.main.temp };
  });

  const pathD = points
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  // Create area path (for gradient fill)
  const areaPath = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="mt-6 sm:mt-8 w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Tendencia de Temperatura
        </h3>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-sm">{trendText}</span>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-6">
        {/* Chart */}
        <div className="relative h-32 sm:h-40 mb-4">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={padding}
                y1={padding + (i * (height - 2 * padding)) / 3}
                x2={width - padding}
                y2={padding + (i * (height - 2 * padding)) / 3}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            ))}

            {/* Area Fill */}
            <motion.path
              d={areaPath}
              fill="url(#tempGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Temperature Line */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />

            {/* Data Points */}
            {points.map((point, index) => (
              <motion.circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="2"
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth="1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              />
            ))}
          </svg>

          {/* Temperature Labels */}
          <div className="absolute top-0 right-2 text-xs text-white/60">
            {formatTemperature(maxTemp, temperatureUnit)}
          </div>
          <div className="absolute bottom-0 right-2 text-xs text-white/60">
            {formatTemperature(minTemp, temperatureUnit)}
          </div>
        </div>

        {/* Time Labels */}
        <div className="flex justify-between text-xs text-white/50">
          {chartData.map((item, index) => (
            <motion.span
              key={item.dt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="text-center"
            >
              {index === 0 ? 'Ahora' : formatHour(item.dt, language)}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
