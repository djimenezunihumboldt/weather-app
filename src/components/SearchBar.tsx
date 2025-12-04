import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Clock, Star, Loader2 } from 'lucide-react';
import { useSearchCities } from '../hooks';
import { useWeatherStore } from '../store';
import type { GeocodingResult, City } from '../types';

interface SearchBarProps {
  onSelectCity: (city: City) => void;
}

export const SearchBar = ({ onSelectCity }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { searchHistory, addToHistory, favorites } = useWeatherStore();

  const { data: results, isLoading } = useSearchCities(query);

  const handleSelect = useCallback(
    (result: GeocodingResult) => {
      const city: City = {
        name: result.name,
        country: result.country,
        lat: result.lat,
        lon: result.lon,
        state: result.state,
      };
      onSelectCity(city);
      addToHistory(`${result.name}, ${result.country}`);
      setQuery('');
      setIsOpen(false);
    },
    [onSelectCity, addToHistory]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  useEffect(() => {
    if (query.length >= 2) {
      setIsOpen(true);
    }
  }, [query]);

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mb-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar ciudad..."
          className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 glass rounded-xl sm:rounded-2xl text-white placeholder-white/50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/60 animate-spin" />
        )}
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1 right-1 sm:left-0 sm:right-0 mt-2 glass rounded-xl sm:rounded-2xl overflow-hidden z-50 max-h-[60vh] sm:max-h-80 overflow-y-auto"
          >
            {/* Search Results */}
            {results && results.length > 0 && (
              <div className="p-2">
                <p className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Resultados
                </p>
                {results.map((result, index) => (
                  <button
                    key={`${result.lat}-${result.lon}-${index}`}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-3 hover:bg-white/10 rounded-lg sm:rounded-xl transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{result.name}</p>
                      <p className="text-white/50 text-xs sm:text-sm truncate">
                        {result.state ? `${result.state}, ` : ''}{result.country}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {query.length >= 2 && !isLoading && (!results || results.length === 0) && (
              <div className="p-4 sm:p-6 text-center text-white/60">
                <p className="text-sm sm:text-base">No se encontraron resultados</p>
                <p className="text-xs sm:text-sm mt-1">Intenta con otra ciudad</p>
              </div>
            )}

            {/* Favorites */}
            {favorites.length > 0 && query.length < 2 && (
              <div className="p-2 border-b border-white/10">
                <p className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Favoritos
                </p>
                {favorites.slice(0, 3).map((fav) => (
                  <button
                    key={fav.id}
                    onClick={() => onSelectCity({ name: fav.name, country: fav.country, lat: fav.lat, lon: fav.lon })}
                    className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-3 hover:bg-white/10 rounded-lg sm:rounded-xl transition-colors text-left"
                  >
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" fill="currentColor" />
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{fav.name}</p>
                      <p className="text-white/50 text-xs sm:text-sm truncate">{fav.country}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && query.length < 2 && (
              <div className="p-2">
                <p className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Búsquedas recientes
                </p>
                {searchHistory.slice(0, 5).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(item.split(',')[0])}
                    className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-3 hover:bg-white/10 rounded-lg sm:rounded-xl transition-colors text-left"
                  >
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 flex-shrink-0" />
                    <p className="text-white/80 text-sm sm:text-base truncate">{item}</p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
