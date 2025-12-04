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
      className="flex items-center justify-between mb-6"
    >
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="text-4xl"
        >
          🌤️
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            Weather App
          </h1>
          {currentCity && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/60 text-sm flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              {currentCity.name}, {currentCity.country}
            </motion.p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Favorite Toggle */}
        {currentCity && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteToggle}
            className="p-2 glass rounded-full hover:bg-white/20 transition-colors"
            aria-label={isCurrentFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            {isCurrentFavorite ? (
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            ) : (
              <HeartOff className="w-5 h-5 text-white" />
            )}
          </motion.button>
        )}

        {/* Refresh Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 glass rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
          aria-label="Actualizar"
        >
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </motion.div>
        </motion.button>

        {/* Settings */}
        <Settings />
      </div>
    </motion.header>
  );
};
