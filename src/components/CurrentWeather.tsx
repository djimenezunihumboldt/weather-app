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
import { ShareWeather } from './ShareWeather';
import { 
  formatTemperature, 
  formatDate, 
  formatVisibility,
  getWindDirection,
  getWeatherEmoji,
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
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center w-full"
    >
      {/* Location & Favorite & Share */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
        <motion.h1 
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {data.name}, {data.sys.country}
        </motion.h1>
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className={`p-1.5 sm:p-2 rounded-full transition-colors ${
              isFav ? 'bg-yellow-500/20' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Star
              className={`w-5 h-5 sm:w-6 sm:h-6 ${isFav ? 'text-yellow-400 fill-yellow-400' : 'text-white/60'}`}
            />
          </motion.button>
          <ShareWeather weatherData={data} />
        </div>
      </div>

      {/* Date & Time */}
      <motion.p 
        className="text-white/70 text-sm sm:text-base md:text-lg mb-4 sm:mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {formatDate(data.dt, "EEEE, d 'de' MMMM", language)} • {formatDate(data.dt, 'HH:mm', language)}
      </motion.p>

      {/* Main Weather Display */}
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        {/* Weather Icon - Emoji */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
          className="relative"
        >
          <span className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] drop-shadow-2xl animate-float block">
            {getWeatherEmoji(data.weather[0].icon)}
          </span>
          <div 
            className={`absolute inset-0 rounded-full blur-3xl opacity-30 ${
              isNight ? 'bg-blue-400' : 'bg-yellow-400'
            }`} 
          />
        </motion.div>

        {/* Temperature */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-thin text-white text-shadow-lg ${getTempColorClass(data.main.temp)}`}>
            {formatTemperature(data.main.temp, temperatureUnit)}
          </p>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 capitalize mt-1 sm:mt-2">
            {data.weather[0].description}
          </p>
          <p className="text-white/60 text-sm sm:text-base mt-1 flex items-center justify-center gap-1">
            <Thermometer className="w-3 h-3 sm:w-4 sm:h-4" />
            Sensación: {formatTemperature(data.main.feels_like, temperatureUnit)}
          </p>
        </motion.div>
      </div>

      {/* Min/Max Temperature */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 text-white/80 text-sm sm:text-base"
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
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
      >
        {/* Humidity */}
        <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300 mx-auto mb-1 sm:mb-2" />
          <p className="text-white/60 text-xs sm:text-sm">Humedad</p>
          <p className="text-white text-base sm:text-lg md:text-xl font-semibold">{data.main.humidity}%</p>
        </div>

        {/* Wind */}
        <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <Wind className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300 mx-auto mb-1 sm:mb-2" />
          <p className="text-white/60 text-xs sm:text-sm">Viento</p>
          <p className="text-white text-base sm:text-lg md:text-xl font-semibold">
            {Math.round(data.wind.speed * 3.6)} km/h
          </p>
          <p className="text-white/50 text-xs hidden sm:block">{getWindDirection(data.wind.deg, language)}</p>
        </div>

        {/* Visibility */}
        <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300 mx-auto mb-1 sm:mb-2" />
          <p className="text-white/60 text-xs sm:text-sm">Visibilidad</p>
          <p className="text-white text-base sm:text-lg md:text-xl font-semibold">{formatVisibility(data.visibility)}</p>
        </div>

        {/* Pressure */}
        <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <Gauge className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 mx-auto mb-1 sm:mb-2" />
          <p className="text-white/60 text-xs sm:text-sm">Presión</p>
          <p className="text-white text-base sm:text-lg md:text-xl font-semibold">{data.main.pressure} hPa</p>
        </div>
      </motion.div>

      {/* Sunrise & Sunset */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 text-white/70 text-sm sm:text-base">
          <Sunrise className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" />
          <span>{formatDate(data.sys.sunrise, 'HH:mm', language)}</span>
        </div>
        <div className="w-px h-4 bg-white/30" />
        <div className="flex items-center gap-1.5 sm:gap-2 text-white/70 text-sm sm:text-base">
          <Sunset className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
          <span>{formatDate(data.sys.sunset, 'HH:mm', language)}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
