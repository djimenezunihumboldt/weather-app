import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, X, Thermometer, Globe, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { useWeatherStore } from '../store';
import type { TemperatureUnit, Language } from '../types';

export const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings } = useWeatherStore();

  const toggleUnit = (unit: TemperatureUnit) => {
    updateSettings({ temperatureUnit: unit });
  };

  const toggleLanguage = (lang: Language) => {
    updateSettings({ language: lang });
  };

  const toggleAutoRefresh = () => {
    updateSettings({ autoRefresh: !settings.autoRefresh });
  };

  const toggleSoundEffects = () => {
    updateSettings({ soundEffects: !settings.soundEffects });
  };

  return (
    <>
      {/* Settings Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="p-2 glass rounded-full hover:bg-white/20 transition-colors"
        aria-label="Configuración"
      >
        <SettingsIcon className="w-5 h-5 text-white" />
      </motion.button>

      {/* Settings Modal */}
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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass rounded-3xl p-6 z-50 m-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Configuración
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* Settings Content */}
              <div className="space-y-6">
                {/* Temperature Unit */}
                <div className="space-y-3">
                  <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    Unidad de temperatura
                  </label>
                  <div className="flex gap-2">
                    {(['celsius', 'fahrenheit'] as TemperatureUnit[]).map((unit) => (
                      <motion.button
                        key={unit}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleUnit(unit)}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                          settings.temperatureUnit === unit
                            ? 'bg-white/30 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {unit === 'celsius' ? '°C' : '°F'}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="space-y-3">
                  <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Idioma
                  </label>
                  <div className="flex gap-2">
                    {([
                      { code: 'es', label: 'Español', flag: '🇪🇸' },
                      { code: 'en', label: 'English', flag: '🇺🇸' },
                    ] as { code: Language; label: string; flag: string }[]).map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleLanguage(lang.code)}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          settings.language === lang.code
                            ? 'bg-white/30 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Auto Refresh */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      {settings.autoRefresh ? (
                        <Sun className="w-4 h-4 text-white" />
                      ) : (
                        <Moon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">Actualización automática</p>
                      <p className="text-white/50 text-sm">Actualizar datos cada 5 min</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleAutoRefresh}
                    className={`w-14 h-8 rounded-full transition-colors relative ${
                      settings.autoRefresh ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.autoRefresh ? 24 : 4 }}
                      className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-lg"
                    />
                  </motion.button>
                </div>

                {/* Sound Effects */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      {settings.soundEffects ? (
                        <Volume2 className="w-4 h-4 text-white" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">Efectos de sonido</p>
                      <p className="text-white/50 text-sm">Sonidos de clima</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleSoundEffects}
                    className={`w-14 h-8 rounded-full transition-colors relative ${
                      settings.soundEffects ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.soundEffects ? 24 : 4 }}
                      className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-lg"
                    />
                  </motion.button>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/40 text-sm text-center">
                  Weather App v1.0.0 • Hecho con ❤️
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
