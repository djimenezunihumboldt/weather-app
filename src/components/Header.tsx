import { motion } from 'framer-motion';
import { MapPin, RefreshCw, Heart, HeartOff } from 'lucide-react';
import { Settings } from './Settings';
import { useWeatherStore } from '../store';
import type { City } from '../types';

interface HeaderProps {
  currentCity: City | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header = ({ currentCity, onRefresh, isRefreshing }: HeaderProps) => {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useWeatherStore();
  const isCurrentFavorite = currentCity ? isFavorite(currentCity.name, currentCity.country) : false;

  const handleFavoriteToggle = () => {
    if (!currentCity) return;

    if (isCurrentFavorite) {
      const favorite = favorites.find(
        f => f.name === currentCity.name && f.country === currentCity.country
      );
      if (favorite) {
        removeFavorite(favorite.id);
      }
    } else {
      addFavorite(currentCity);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-6 w-full"
    >
      {/* Logo & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0"
        >
          🌤️
        </motion.div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
            Weather App
          </h1>
          {currentCity && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/60 text-xs sm:text-sm flex items-center gap-1 truncate"
            >
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{currentCity.name}, {currentCity.country}</span>
            </motion.p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Favorite Toggle */}
        {currentCity && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteToggle}
            className="p-1.5 sm:p-2 glass rounded-full hover:bg-white/20 transition-colors"
            aria-label={isCurrentFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            {isCurrentFavorite ? (
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 fill-red-400" />
            ) : (
              <HeartOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </motion.button>
        )}

        {/* Refresh Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 sm:p-2 glass rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
          aria-label="Actualizar"
        >
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </motion.div>
        </motion.button>

        {/* Settings */}
        <Settings />
      </div>
    </motion.header>
  );
};
