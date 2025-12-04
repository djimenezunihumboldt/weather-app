import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, X, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import type { WeatherData } from '../types';
import { useWeatherStore } from '../store';
import { formatTemperature } from '../utils';

interface ShareWeatherProps {
  weatherData: WeatherData;
}

export const ShareWeather = ({ weatherData }: ShareWeatherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { settings } = useWeatherStore();

  const weatherText = `🌡️ ${weatherData.name}, ${weatherData.sys.country}
${formatTemperature(weatherData.main.temp, settings.temperatureUnit)} - ${weatherData.weather[0].description}
💧 Humedad: ${weatherData.main.humidity}%
💨 Viento: ${Math.round(weatherData.wind.speed * 3.6)} km/h

Vía ClimaVzla 🇻🇪`;

  const shareUrl = 'https://djimenezunihumboldt.github.io/weather-app/';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(weatherText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying:', err);
    }
  };

  const handleShare = async (platform: 'twitter' | 'facebook' | 'whatsapp' | 'native') => {
    const encodedText = encodeURIComponent(weatherText);
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}%0A${encodedUrl}`, '_blank');
        break;
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title: `Clima en ${weatherData.name}`,
              text: weatherText,
              url: shareUrl,
            });
          } catch (err) {
            // User cancelled or error
          }
        }
        break;
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="p-2 sm:p-2.5 glass rounded-xl hover:bg-white/20 transition-colors"
        title="Compartir clima"
      >
        <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </motion.button>

      {/* Share Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm glass rounded-2xl p-5 z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Compartir Clima</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Preview */}
              <div className="bg-black/20 rounded-xl p-3 mb-4 text-sm text-white/80 whitespace-pre-line">
                {weatherText}
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center gap-1 p-3 bg-green-500/20 hover:bg-green-500/30 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-green-400" />
                  <span className="text-xs text-white/70">WhatsApp</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center gap-1 p-3 bg-blue-400/20 hover:bg-blue-400/30 rounded-xl transition-colors"
                >
                  <Twitter className="w-6 h-6 text-blue-400" />
                  <span className="text-xs text-white/70">Twitter</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center gap-1 p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl transition-colors"
                >
                  <Facebook className="w-6 h-6 text-blue-500" />
                  <span className="text-xs text-white/70">Facebook</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopy}
                  className="flex flex-col items-center gap-1 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  {copied ? (
                    <Check className="w-6 h-6 text-green-400" />
                  ) : (
                    <Copy className="w-6 h-6 text-white" />
                  )}
                  <span className="text-xs text-white/70">{copied ? '¡Copiado!' : 'Copiar'}</span>
                </motion.button>
              </div>

              {/* Native Share (if available) */}
              {'share' in navigator && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleShare('native')}
                  className="w-full py-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-xl text-yellow-400 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Más opciones
                </motion.button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
