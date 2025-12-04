import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Clock, Star, Loader2 } from 'lucide-react';
import { useSearchCities } from '../hooks';
import { useWeatherStore } from '../store';
import type { GeocodingResult } from '../types';

interface SearchBarProps {
  onSelectCity: (lat: number, lon: number, name: string, country: string) => void;
}

export const SearchBar = ({ onSelectCity }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { searchHistory, addToHistory, favorites } = useWeatherStore();

  const { data: results, isLoading } = useSearchCities(query);

  const handleSelect = useCallback(
    (result: GeocodingResult) => {
      onSelectCity(result.lat, result.lon, result.name, result.country);
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
    <div className="relative w-full max-w-md mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar ciudad..."
          className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && (query.length >= 2 || searchHistory.length > 0 || favorites.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl z-50"
          >
            {/* Loading State */}
            {isLoading && query.length >= 2 && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}

            {/* Search Results */}
            {results && results.length > 0 && (
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Resultados
                </p>
                {results.map((result, index) => (
                  <motion.button
                    key={`${result.lat}-${result.lon}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/10 rounded-xl transition-colors text-left"
                  >
                    <MapPin className="w-5 h-5 text-white/60 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">{result.name}</p>
                      <p className="text-white/50 text-sm">
                        {result.state && `${result.state}, `}
                        {result.country}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* No Results */}
            {results && results.length === 0 && query.length >= 2 && !isLoading && (
              <div className="py-8 text-center text-white/50">
                <p>No se encontraron ciudades</p>
              </div>
            )}

            {/* Favorites */}
            {favorites.length > 0 && query.length < 2 && (
              <div className="p-2 border-b border-white/10">
                <p className="px-3 py-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Favoritos
                </p>
                {favorites.slice(0, 3).map((fav) => (
                  <button
                    key={fav.id}
                    onClick={() => onSelectCity(fav.lat, fav.lon, fav.name, fav.country)}
                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/10 rounded-xl transition-colors text-left"
                  >
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="currentColor" />
                    <div>
                      <p className="text-white font-medium">{fav.name}</p>
                      <p className="text-white/50 text-sm">{fav.country}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && query.length < 2 && (
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Búsquedas recientes
                </p>
                {searchHistory.slice(0, 5).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(item.split(',')[0])}
                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/10 rounded-xl transition-colors text-left"
                  >
                    <Clock className="w-5 h-5 text-white/40 flex-shrink-0" />
                    <p className="text-white/80">{item}</p>
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
