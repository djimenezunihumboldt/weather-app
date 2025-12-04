import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, Snowflake, CloudLightning, Wind } from 'lucide-react';
import type { WeatherCondition } from '../types';

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  isDay: boolean;
}

export const WeatherBackground = ({ condition, isDay }: WeatherBackgroundProps) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base Gradient */}
      <motion.div
        key={`${condition}-${isDay}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 ${getBackgroundGradient(condition, isDay)}`}
      />

      {/* Animated Elements based on condition */}
      <WeatherElements condition={condition} isDay={isDay} />

      {/* Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
    </div>
  );
};

const getBackgroundGradient = (condition: WeatherCondition, isDay: boolean): string => {
  const gradients: Record<WeatherCondition, { day: string; night: string }> = {
    clear: {
      day: 'bg-gradient-to-br from-blue-400 via-sky-500 to-cyan-400',
      night: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800',
    },
    clouds: {
      day: 'bg-gradient-to-br from-gray-400 via-slate-400 to-gray-500',
      night: 'bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900',
    },
    rain: {
      day: 'bg-gradient-to-br from-slate-500 via-gray-600 to-slate-700',
      night: 'bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900',
    },
    drizzle: {
      day: 'bg-gradient-to-br from-slate-400 via-gray-500 to-slate-500',
      night: 'bg-gradient-to-br from-slate-700 via-gray-800 to-slate-800',
    },
    thunderstorm: {
      day: 'bg-gradient-to-br from-slate-700 via-purple-900 to-slate-800',
      night: 'bg-gradient-to-br from-slate-900 via-purple-950 to-black',
    },
    snow: {
      day: 'bg-gradient-to-br from-blue-200 via-slate-200 to-white',
      night: 'bg-gradient-to-br from-slate-600 via-blue-900 to-slate-800',
    },
    mist: {
      day: 'bg-gradient-to-br from-gray-300 via-slate-400 to-gray-400',
      night: 'bg-gradient-to-br from-gray-700 via-slate-700 to-gray-800',
    },
    fog: {
      day: 'bg-gradient-to-br from-gray-400 via-slate-300 to-gray-300',
      night: 'bg-gradient-to-br from-gray-600 via-slate-600 to-gray-700',
    },
    haze: {
      day: 'bg-gradient-to-br from-amber-200 via-orange-300 to-yellow-200',
      night: 'bg-gradient-to-br from-amber-800 via-orange-900 to-slate-800',
    },
    dust: {
      day: 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400',
      night: 'bg-gradient-to-br from-yellow-800 via-amber-900 to-slate-900',
    },
    smoke: {
      day: 'bg-gradient-to-br from-gray-400 via-slate-500 to-gray-500',
      night: 'bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900',
    },
  };

  return gradients[condition]?.[isDay ? 'day' : 'night'] || gradients.clear[isDay ? 'day' : 'night'];
};

const WeatherElements = ({ condition, isDay }: { condition: WeatherCondition; isDay: boolean }) => {
  switch (condition) {
    case 'clear':
      return isDay ? <SunElements /> : <StarsElements />;
    case 'clouds':
      return <CloudsElements />;
    case 'rain':
    case 'drizzle':
      return <RainElements />;
    case 'thunderstorm':
      return <ThunderstormElements />;
    case 'snow':
      return <SnowElements />;
    case 'mist':
    case 'fog':
    case 'haze':
      return <MistElements />;
    default:
      return null;
  }
};

const SunElements = () => (
  <>
    {/* Sun */}
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute top-20 right-20"
    >
      <Sun className="w-32 h-32 text-yellow-300 drop-shadow-[0_0_30px_rgba(253,224,71,0.5)]" />
    </motion.div>

    {/* Sun rays */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.2,
        }}
        style={{
          position: 'absolute',
          top: '80px',
          right: '80px',
          width: '200px',
          height: '2px',
          background: 'linear-gradient(to right, rgba(253,224,71,0.5), transparent)',
          transformOrigin: 'left center',
          transform: `rotate(${i * 45}deg)`,
        }}
      />
    ))}
  </>
);

const StarsElements = () => (
  <>
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{
          top: `${Math.random() * 60}%`,
          left: `${Math.random() * 100}%`,
        }}
      />
    ))}
    {/* Moon */}
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-16 right-16 w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-[0_0_60px_rgba(255,255,255,0.3)]"
    />
  </>
);

const CloudsElements = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          x: ['-10%', '110%'],
        }}
        transition={{
          duration: 30 + i * 10,
          repeat: Infinity,
          ease: 'linear',
          delay: i * 5,
        }}
        style={{
          position: 'absolute',
          top: `${10 + i * 12}%`,
        }}
      >
        <Cloud
          className={`text-white/30 ${
            i % 2 === 0 ? 'w-32 h-32' : 'w-24 h-24'
          }`}
        />
      </motion.div>
    ))}
  </>
);

const RainElements = () => (
  <>
    <CloudsElements />
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: ['0%', '100vh'],
          opacity: [0.7, 0],
        }}
        transition={{
          duration: 1 + Math.random(),
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: 'linear',
        }}
        className="absolute w-0.5 h-8 bg-gradient-to-b from-blue-400/60 to-transparent rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: '-10%',
        }}
      />
    ))}
  </>
);

const ThunderstormElements = () => (
  <>
    <RainElements />
    <motion.div
      animate={{
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: Math.random() * 5 + 3,
      }}
      className="absolute inset-0 bg-white/30"
    />
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: Math.random() * 8 + 2,
        }}
        style={{
          position: 'absolute',
          top: '20%',
          left: `${20 + i * 30}%`,
        }}
      >
        <CloudLightning className="w-16 h-16 text-yellow-400" />
      </motion.div>
    ))}
  </>
);

const SnowElements = () => (
  <>
    {[...Array(60)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: ['0%', '100vh'],
          x: ['-10px', '10px', '-10px'],
          rotate: [0, 360],
        }}
        transition={{
          duration: 5 + Math.random() * 5,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: '-5%',
        }}
      >
        <Snowflake className={`text-white/70 ${Math.random() > 0.5 ? 'w-4 h-4' : 'w-2 h-2'}`} />
      </motion.div>
    ))}
  </>
);

const MistElements = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          x: ['-50%', '50%', '-50%'],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 20 + i * 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-full h-32 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          top: `${i * 20}%`,
        }}
      />
    ))}
    <Wind className="absolute top-1/4 left-1/4 w-16 h-16 text-white/20" />
  </>
);
