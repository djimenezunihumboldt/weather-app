import { motion } from 'framer-motion';
import { 
  Droplets, 
  Wind, 
  Gauge, 
  Eye, 
  Sunrise, 
  Sunset,
  Thermometer,
  CloudRain
} from 'lucide-react';
import type { WeatherData } from '../types';
import { useWeatherStore } from '../store';
import { formatTime } from '../utils';

interface WeatherDetailsProps {
  data: WeatherData;
}

export const WeatherDetails = ({ data }: WeatherDetailsProps) => {
  const { settings } = useWeatherStore();
  const { language } = settings;

  const details = [
    {
      icon: Thermometer,
      label: 'Sensación térmica',
      value: `${Math.round(data.main.feels_like)}°`,
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Droplets,
      label: 'Humedad',
      value: `${data.main.humidity}%`,
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: Wind,
      label: 'Viento',
      value: `${Math.round(data.wind.speed * 3.6)} km/h`,
      color: 'from-teal-400 to-green-500',
    },
    {
      icon: Gauge,
      label: 'Presión',
      value: `${data.main.pressure} hPa`,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Eye,
      label: 'Visibilidad',
      value: `${Math.round(data.visibility / 1000)} km`,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: CloudRain,
      label: 'Nubes',
      value: `${data.clouds.all}%`,
      color: 'from-gray-400 to-gray-600',
    },
  ];

  const sunTimes = [
    {
      icon: Sunrise,
      label: 'Amanecer',
      value: formatTime(data.sys.sunrise, data.timezone, language),
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Sunset,
      label: 'Atardecer',
      value: formatTime(data.sys.sunset, data.timezone, language),
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-6 sm:mt-8 w-full"
    >
      <h3 className="text-lg font-semibold text-white mb-4">
        Detalles del clima
      </h3>

      {/* Main Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mb-6">
        {details.map((detail, index) => (
          <motion.div
            key={detail.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${detail.color}`}>
                <detail.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs">{detail.label}</p>
                <p className="text-white font-semibold">{detail.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sun Times */}
      <div className="grid grid-cols-2 gap-3">
        {sunTimes.map((time, index) => (
          <motion.div
            key={time.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + 0.1 * index }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${time.color}`}>
                <time.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">{time.label}</p>
                <p className="text-white text-xl font-semibold">{time.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Wind Direction */}
      {data.wind.deg !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                <Wind className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Dirección del viento</p>
                <p className="text-white font-semibold">
                  {getWindDirection(data.wind.deg)}
                </p>
              </div>
            </div>
            
            {/* Wind Compass */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-white/20" />
              <motion.div
                animate={{ rotate: data.wind.deg }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-1 h-5 bg-gradient-to-b from-red-500 to-transparent rounded-full" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Helper function to convert wind degrees to direction
function getWindDirection(degrees: number): string {
  const directions = [
    'Norte', 'NNE', 'NE', 'ENE',
    'Este', 'ESE', 'SE', 'SSE',
    'Sur', 'SSO', 'SO', 'OSO',
    'Oeste', 'ONO', 'NO', 'NNO'
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
