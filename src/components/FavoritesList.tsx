import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, MapPin } from 'lucide-react';
import { useWeatherStore } from '../store';
import type { FavoriteCity } from '../types';

interface FavoritesListProps {
  onSelectCity: (city: FavoriteCity) => void;
}

export const FavoritesList = ({ onSelectCity }: FavoritesListProps) => {
  const { favorites, removeFavorite, currentCity } = useWeatherStore();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-6 sm:mt-8 w-full"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-400" />
        Ciudades favoritas
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {favorites.map((city, index) => {
            const isActive = currentCity?.name === city.name && currentCity?.country === city.country;

            return (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ delay: 0.05 * index }}
                layout
                className={`glass rounded-xl p-3 cursor-pointer transition-all group relative ${
                  isActive ? 'ring-2 ring-white/50' : ''
                }`}
              >
                {/* Main Content - Clickable */}
                <div
                  onClick={() => onSelectCity(city)}
                  className="flex items-center gap-2"
                >
                  <div className="p-2 bg-white/10 rounded-lg">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {city.name}
                    </p>
                    <p className="text-white/50 text-xs">
                      {city.country}
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(city.id);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500/20 hover:bg-red-500/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Eliminar de favoritos"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
