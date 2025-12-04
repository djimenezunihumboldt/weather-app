import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, MapPin, Wifi, WifiOff } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  type?: 'location' | 'network' | 'api' | 'general';
}

export const ErrorDisplay = ({ message, onRetry, type = 'general' }: ErrorDisplayProps) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'location':
        return <MapPin className="w-12 h-12" />;
      case 'network':
        return <WifiOff className="w-12 h-12" />;
      default:
        return <AlertCircle className="w-12 h-12" />;
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case 'location':
        return '¡Ubicación no encontrada!';
      case 'network':
        return '¡Sin conexión!';
      case 'api':
        return '¡Error del servidor!';
      default:
        return '¡Algo salió mal!';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-8 text-center max-w-md mx-auto"
    >
      {/* Error Icon */}
      <motion.div
        animate={{ 
          y: [0, -5, 0],
          rotate: type === 'network' ? [0, 10, -10, 0] : 0 
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-red-400 flex justify-center mb-4"
      >
        {getErrorIcon()}
      </motion.div>

      {/* Error Title */}
      <h3 className="text-xl font-semibold text-white mb-2">
        {getErrorTitle()}
      </h3>

      {/* Error Message */}
      <p className="text-white/60 mb-6">
        {message}
      </p>

      {/* Retry Button */}
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Intentar de nuevo
        </motion.button>
      )}

      {/* Network Status Indicator */}
      {type === 'network' && (
        <div className="mt-6 flex items-center justify-center gap-2 text-white/40 text-sm">
          <Wifi className="w-4 h-4" />
          <span>Comprueba tu conexión a internet</span>
        </div>
      )}
    </motion.div>
  );
};
