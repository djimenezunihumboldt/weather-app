import { motion } from 'framer-motion';
import { Wind, AlertTriangle, Shield, Leaf, Skull } from 'lucide-react';

interface AirQualityData {
  list: Array<{
    main: {
      aqi: number; // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
    };
    components: {
      co: number;    // Carbon monoxide
      no: number;    // Nitrogen monoxide
      no2: number;   // Nitrogen dioxide
      o3: number;    // Ozone
      so2: number;   // Sulphur dioxide
      pm2_5: number; // Fine particles
      pm10: number;  // Coarse particles
      nh3: number;   // Ammonia
    };
  }>;
}

interface AirQualityProps {
  data: AirQualityData | null;
  isLoading?: boolean;
}

const AQI_LEVELS = [
  { min: 1, max: 1, label: 'Bueno', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/20', textColor: 'text-green-400', icon: Leaf, description: 'Calidad del aire satisfactoria' },
  { min: 2, max: 2, label: 'Aceptable', color: 'from-lime-500 to-green-500', bgColor: 'bg-lime-500/20', textColor: 'text-lime-400', icon: Shield, description: 'Calidad aceptable para la mayoría' },
  { min: 3, max: 3, label: 'Moderado', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400', icon: AlertTriangle, description: 'Grupos sensibles deben limitar exposición' },
  { min: 4, max: 4, label: 'Malo', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-500/20', textColor: 'text-orange-400', icon: AlertTriangle, description: 'Efectos adversos posibles en la salud' },
  { min: 5, max: 5, label: 'Muy Malo', color: 'from-red-500 to-purple-600', bgColor: 'bg-red-500/20', textColor: 'text-red-400', icon: Skull, description: 'Condiciones de emergencia de salud' },
];

const getAQILevel = (aqi: number) => {
  return AQI_LEVELS.find(level => aqi >= level.min && aqi <= level.max) || AQI_LEVELS[0];
};

export const AirQuality = ({ data, isLoading }: AirQualityProps) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 sm:mt-8 w-full"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Wind className="w-5 h-5" />
          Calidad del Aire
        </h3>
        <div className="glass rounded-2xl p-6">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-white/10" />
            <div className="h-6 w-32 bg-white/10 rounded" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!data || !data.list || data.list.length === 0) {
    return null;
  }

  const airData = data.list[0];
  const aqi = airData.main.aqi;
  const level = getAQILevel(aqi);
  const Icon = level.icon;

  const pollutants = [
    { name: 'PM2.5', value: airData.components.pm2_5, unit: 'μg/m³', max: 75 },
    { name: 'PM10', value: airData.components.pm10, unit: 'μg/m³', max: 150 },
    { name: 'O₃', value: airData.components.o3, unit: 'μg/m³', max: 180 },
    { name: 'NO₂', value: airData.components.no2, unit: 'μg/m³', max: 200 },
    { name: 'SO₂', value: airData.components.so2, unit: 'μg/m³', max: 350 },
    { name: 'CO', value: airData.components.co / 1000, unit: 'mg/m³', max: 10 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-6 sm:mt-8 w-full"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Wind className="w-5 h-5" />
        Calidad del Aire
      </h3>

      <div className="glass rounded-2xl p-4 sm:p-6">
        {/* Main AQI Display */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
          {/* AQI Circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center`}
          >
            <div className="absolute inset-2 rounded-full bg-black/30 flex items-center justify-center flex-col">
              <span className="text-3xl sm:text-4xl font-bold text-white">{aqi}</span>
              <span className="text-xs text-white/70">AQI</span>
            </div>
          </motion.div>

          {/* AQI Info */}
          <div className="text-center sm:text-left flex-1">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${level.bgColor} mb-2`}>
              <Icon className={`w-4 h-4 ${level.textColor}`} />
              <span className={`font-semibold ${level.textColor}`}>{level.label}</span>
            </div>
            <p className="text-white/70 text-sm">{level.description}</p>
          </div>
        </div>

        {/* Pollutants Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pollutants.map((pollutant, index) => {
            const percentage = Math.min((pollutant.value / pollutant.max) * 100, 100);
            const barColor = percentage < 50 ? 'bg-green-500' : percentage < 75 ? 'bg-yellow-500' : 'bg-red-500';
            
            return (
              <motion.div
                key={pollutant.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/5 rounded-xl p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-xs">{pollutant.name}</span>
                  <span className="text-white text-sm font-medium">
                    {pollutant.value.toFixed(1)}
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + 0.1 * index }}
                    className={`h-full rounded-full ${barColor}`}
                  />
                </div>
                <span className="text-white/40 text-xs">{pollutant.unit}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
