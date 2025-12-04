import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { City } from '../types';

interface QuickCitiesProps {
  onSelectCity: (city: City) => void;
  currentCity: City | null;
}

// Principales ciudades de Venezuela
const VENEZUELAN_CITIES: City[] = [
  { name: 'Caracas', country: 'VE', lat: 10.4806, lon: -66.9036 },
  { name: 'Maracaibo', country: 'VE', lat: 10.6666, lon: -71.6124 },
  { name: 'Valencia', country: 'VE', lat: 10.1620, lon: -67.9963 },
  { name: 'Barquisimeto', country: 'VE', lat: 10.0678, lon: -69.3467 },
  { name: 'Maracay', country: 'VE', lat: 10.2469, lon: -67.5958 },
  { name: 'Mérida', country: 'VE', lat: 8.5897, lon: -71.1561 },
  { name: 'San Cristóbal', country: 'VE', lat: 7.7669, lon: -72.2250 },
  { name: 'Puerto La Cruz', country: 'VE', lat: 10.2165, lon: -64.6320 },
  { name: 'Ciudad Guayana', country: 'VE', lat: 8.3620, lon: -62.6508 },
  { name: 'Barinas', country: 'VE', lat: 8.6226, lon: -70.2070 },
  { name: 'Maturín', country: 'VE', lat: 9.7457, lon: -63.1830 },
  { name: 'Cumaná', country: 'VE', lat: 10.4636, lon: -64.1676 },
];

export const QuickCities = ({ onSelectCity, currentCity }: QuickCitiesProps) => {
  // Filter out current city - show more on desktop
  const citiesToShow = VENEZUELAN_CITIES
    .filter(city => city.name !== currentCity?.name)
    .slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6 lg:mb-8"
    >
      <p className="text-white/50 text-xs lg:text-sm mb-2 lg:mb-3 flex items-center gap-1">
        <MapPin className="w-3 h-3 lg:w-4 lg:h-4" />
        Ciudades de Venezuela
      </p>
      <div className="flex flex-wrap gap-2 lg:gap-3 justify-center lg:justify-start">
        {citiesToShow.map((city, index) => (
          <motion.button
            key={city.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCity(city)}
            className="px-3 py-1.5 lg:px-4 lg:py-2 glass rounded-full text-white/80 text-xs sm:text-sm lg:text-base hover:bg-white/20 transition-colors flex items-center gap-1"
          >
            <span className="text-yellow-400">📍</span>
            {city.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export { VENEZUELAN_CITIES };
