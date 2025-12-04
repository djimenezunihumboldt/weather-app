import { motion } from 'framer-motion';
import { Sun, AlertTriangle, Glasses, Umbrella, ShieldAlert } from 'lucide-react';

interface UVIndexProps {
  uvIndex: number;
}

const UV_LEVELS = [
  { min: 0, max: 2, label: 'Bajo', color: 'from-green-400 to-green-500', textColor: 'text-green-400', icon: Sun, advice: 'Protección mínima necesaria' },
  { min: 3, max: 5, label: 'Moderado', color: 'from-yellow-400 to-yellow-500', textColor: 'text-yellow-400', icon: Glasses, advice: 'Usa gafas de sol y protector solar' },
  { min: 6, max: 7, label: 'Alto', color: 'from-orange-400 to-orange-500', textColor: 'text-orange-400', icon: AlertTriangle, advice: 'Reduce exposición entre 10am-4pm' },
  { min: 8, max: 10, label: 'Muy Alto', color: 'from-red-400 to-red-500', textColor: 'text-red-400', icon: ShieldAlert, advice: 'Evita exposición prolongada' },
  { min: 11, max: 20, label: 'Extremo', color: 'from-purple-500 to-purple-600', textColor: 'text-purple-400', icon: Umbrella, advice: 'Evita salir al aire libre' },
];

const getUVLevel = (uv: number) => {
  return UV_LEVELS.find(level => uv >= level.min && uv <= level.max) || UV_LEVELS[0];
};

export const UVIndex = ({ uvIndex }: UVIndexProps) => {
  const level = getUVLevel(Math.round(uvIndex));
  const Icon = level.icon;
  const normalizedUV = Math.min(uvIndex / 11, 1) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${level.color}`}>
          <Sun className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white/60 text-xs">Índice UV</p>
          <div className="flex items-center gap-2">
            <span className="text-white text-xl font-bold">{Math.round(uvIndex)}</span>
            <span className={`text-sm ${level.textColor}`}>{level.label}</span>
          </div>
        </div>
      </div>

      {/* UV Bar */}
      <div className="h-2 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-purple-600 rounded-full mb-2 relative">
        <motion.div
          initial={{ left: 0 }}
          animate={{ left: `${normalizedUV}%` }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-gray-800"
          style={{ marginLeft: '-6px' }}
        />
      </div>

      {/* Advice */}
      <div className="flex items-center gap-2 mt-3">
        <Icon className={`w-4 h-4 ${level.textColor}`} />
        <p className="text-white/60 text-xs">{level.advice}</p>
      </div>
    </motion.div>
  );
};
