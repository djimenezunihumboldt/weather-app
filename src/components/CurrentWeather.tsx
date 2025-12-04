import { motion } from 'framer-motion';
import { 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  Thermometer,
  Star
} from 'lucide-react';
import type { WeatherData } from '../types';
import { useWeatherStore } from '../store';
import { 
  formatTemperature, 
  formatDate, 
  formatVisibility,
  getWindDirection,
  getWeatherIconUrl,
  getTempColorClass
} from '../utils';

interface CurrentWeatherProps {
  data: WeatherData;
}

export const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  const { settings, addFavorite, removeFavorite, isFavorite, favorites } = useWeatherStore();
  const { temperatureUnit, language } = settings;

  const isNight = data.dt < data.sys.sunrise || data.dt > data.sys.sunset;
  const isFav = isFavorite(data.name, data.sys.country);

  const handleToggleFavorite = () => {
    if (isFav) {
      const fav = favorites.find(
        (f) => f.name.toLowerCase() === data.name.toLowerCase() && f.country === data.sys.country
      );
      if (fav) removeFavorite(fav.id);
    } else {
      addFavorite({
        id: `${data.name}-${data.sys.country}-${Date.now()}`,
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
        addedAt: Date.now(),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {/* Location & Favorite */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-white text-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {data.name}, {data.sys.country}
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleFavorite}
          className={`p-2 rounded-full transition-colors ${
            isFav ? 'bg-yellow-500/20' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          <Star
            className={`w-6 h-6 ${isFav ? 'text-yellow-400 fill-yellow-400' : 'text-white/60'}`}
          />
        </motion.button>
      </div>

      {/* Date & Time */}
      <motion.p 
        className="text-white/70 text-lg mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {formatDate(data.dt, "EEEE, d 'de' MMMM", language)} • {formatDate(data.dt, 'HH:mm', language)}
      </motion.p>

      {/* Main Weather Display */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
        {/* Weather Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
          className="relative"
        >
          <img
            src={getWeatherIconUrl(data.weather[0].icon)}
            alt={data.weather[0].description}
            className="w-40 h-40 md:w-48 md:h-48 drop-shadow-2xl animate-float"
          />
          {/* Glow effect */}
          <div 
            className={`absolute inset-0 rounded-full blur-3xl opacity-30 ${
              isNight ? 'bg-blue-400' : 'bg-yellow-400'
            }`} 
          />
        </motion.div>

        {/* Temperature */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center md:text-left"
        >
          <p className={`text-8xl md:text-9xl font-thin text-white text-shadow-lg ${getTempColorClass(data.main.temp)}`}>
            {formatTemperature(data.main.temp, temperatureUnit)}
          </p>
          <p className="text-2xl text-white/80 capitalize mt-2">
            {data.weather[0].description}
          </p>
          <p className="text-white/60 mt-1">
            <Thermometer className="w-4 h-4 inline mr-1" />
            Sensación: {formatTemperature(data.main.feels_like, temperatureUnit)}
          </p>
        </motion.div>
      </div>

      {/* Min/Max Temperature */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-6 mb-8 text-white/80"
      >
        <span>↓ Mín: {formatTemperature(data.main.temp_min, temperatureUnit)}</span>
        <span className="w-px h-4 bg-white/30" />
        <span>↑ Máx: {formatTemperature(data.main.temp_max, temperatureUnit)}</span>
      </motion.div>

      {/* Weather Details Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* Humidity */}
        <div className="glass rounded-2xl p-4">
          <Droplets className="w-6 h-6 text-blue-300 mx-auto mb-2" />
          <p className="text-white/60 text-sm">Humedad</p>
          <p className="text-white text-xl font-semibold">{data.main.humidity}%</p>
        </div>

        {/* Wind */}
        <div className="glass rounded-2xl p-4">
          <Wind className="w-6 h-6 text-cyan-300 mx-auto mb-2" />
          <p className="text-white/60 text-sm">Viento</p>
          <p className="text-white text-xl font-semibold">
            {Math.round(data.wind.speed * 3.6)} km/h
          </p>
          <p className="text-white/50 text-xs">{getWindDirection(data.wind.deg, language)}</p>
        </div>

        {/* Visibility */}
        <div className="glass rounded-2xl p-4">
          <Eye className="w-6 h-6 text-purple-300 mx-auto mb-2" />
          <p className="text-white/60 text-sm">Visibilidad</p>
          <p className="text-white text-xl font-semibold">{formatVisibility(data.visibility)}</p>
        </div>

        {/* Pressure */}
        <div className="glass rounded-2xl p-4">
          <Gauge className="w-6 h-6 text-green-300 mx-auto mb-2" />
          <p className="text-white/60 text-sm">Presión</p>
          <p className="text-white text-xl font-semibold">{data.main.pressure} hPa</p>
        </div>
      </motion.div>

      {/* Sunrise & Sunset */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center gap-8 mt-6"
      >
        <div className="flex items-center gap-2 text-white/70">
          <Sunrise className="w-5 h-5 text-orange-300" />
          <span>{formatDate(data.sys.sunrise, 'HH:mm', language)}</span>
        </div>
        <div className="w-px h-4 bg-white/30" />
        <div className="flex items-center gap-2 text-white/70">
          <Sunset className="w-5 h-5 text-orange-500" />
          <span>{formatDate(data.sys.sunset, 'HH:mm', language)}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
