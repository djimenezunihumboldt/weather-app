import { useState, useEffect, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Header,
  SearchBar,
  CurrentWeather,
  HourlyForecast,
  Forecast,
  WeatherDetails,
  FavoritesList,
  WeatherBackground,
  LoadingScreen,
  ErrorDisplay,
  AirQuality,
  TemperatureChart,
  WeatherSummary,
  QuickCities,
} from './components';
import { useCurrentWeather, useForecast, useGeolocation, useAirQuality } from './hooks';
import { useWeatherStore } from './store';
import type { City, FavoriteCity, WeatherConditionType } from './types';
import { mapWeatherCondition, isNightTime } from './utils';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Default city if geolocation fails
const DEFAULT_CITY: City = {
  name: 'Caracas',
  country: 'VE',
  lat: 10.4806,
  lon: -66.9036,
};

function WeatherApp() {
  const { currentCity, setCurrentCity, settings } = useWeatherStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasTriedGeo, setHasTriedGeo] = useState(false);
  const [forceShowApp, setForceShowApp] = useState(false);

  // Geolocation hook
  const {
    location: geoLocation,
    error: geoError,
    isLoading: isGeoLoading,
    requestLocation,
  } = useGeolocation();

  // Weather data hooks
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useCurrentWeather(
    currentCity?.lat ?? 0,
    currentCity?.lon ?? 0,
    settings.language,
    {
      enabled: !!currentCity,
    }
  );

  const {
    data: forecastData,
    isLoading: isForecastLoading,
    error: forecastError,
    refetch: refetchForecast,
  } = useForecast(
    currentCity?.lat ?? 0,
    currentCity?.lon ?? 0,
    settings.language,
    {
      enabled: !!currentCity,
    }
  );

  // Air quality data
  const {
    data: airQualityData,
    isLoading: isAirQualityLoading,
  } = useAirQuality(
    currentCity?.lat ?? 0,
    currentCity?.lon ?? 0,
    {
      enabled: !!currentCity,
    }
  );

  // Initial load - try geolocation OR use default city
  useEffect(() => {
    if (!hasTriedGeo && !currentCity) {
      setHasTriedGeo(true);
      
      // Try geolocation with a timeout
      const geoPromise = requestLocation();
      
      // Fallback to default city after 3 seconds
      const timeoutId = setTimeout(() => {
        if (!currentCity) {
          console.log('Geolocation timeout, using default city');
          setCurrentCity(DEFAULT_CITY);
          setForceShowApp(true);
        }
      }, 3000);
      
      // If geolocation succeeds, clear the timeout
      geoPromise.then((result) => {
        if (result) {
          clearTimeout(timeoutId);
        }
      }).catch(() => {
        // Error handled by timeout
      });
      
      return () => clearTimeout(timeoutId);
    }
  }, [hasTriedGeo, currentCity, requestLocation, setCurrentCity]);

  // Fallback timer - force show app after 5 seconds no matter what
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!currentCity) {
        setCurrentCity(DEFAULT_CITY);
      }
      setForceShowApp(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentCity, setCurrentCity]);

  // Handle geolocation result
  useEffect(() => {
    if (geoLocation && !currentCity) {
      setCurrentCity({
        name: geoLocation.name || 'Tu ubicación',
        country: geoLocation.country || '',
        lat: geoLocation.lat,
        lon: geoLocation.lon,
      });
    }
  }, [geoLocation, currentCity, setCurrentCity]);

  // Handle geolocation error - use default city immediately
  useEffect(() => {
    if (geoError && !currentCity) {
      console.log('Geolocation error, using default city:', geoError);
      setCurrentCity(DEFAULT_CITY);
    }
  }, [geoError, currentCity, setCurrentCity]);

  // Handle search selection
  const handleCitySelect = useCallback((city: City) => {
    setCurrentCity(city);
  }, [setCurrentCity]);

  // Handle favorite city selection
  const handleFavoriteSelect = useCallback((favorite: FavoriteCity) => {
    setCurrentCity({
      name: favorite.name,
      country: favorite.country,
      lat: favorite.lat,
      lon: favorite.lon,
    });
  }, [setCurrentCity]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchWeather(), refetchForecast()]);
    setIsRefreshing(false);
  }, [refetchWeather, refetchForecast]);

  // Auto refresh
  useEffect(() => {
    if (!settings.autoRefresh || !currentCity) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [settings.autoRefresh, currentCity, handleRefresh]);

  // Determine weather condition for background
  const weatherCondition: WeatherConditionType = weatherData
    ? mapWeatherCondition(weatherData.weather[0].main)
    : 'clear';

  const isNight = weatherData
    ? isNightTime(weatherData.dt, weatherData.sys.sunrise, weatherData.sys.sunset)
    : false;

  // Loading state
  const isLoading = isGeoLoading || (currentCity && (isWeatherLoading || isForecastLoading));
  const hasError = weatherError || forecastError || geoError;

  // Show loading screen only while getting initial data
  // Force show app after timeout to prevent infinite loading
  if (!forceShowApp && !weatherData && isLoading && !hasError) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen min-h-dvh relative safe-area-top safe-area-bottom flex flex-col">
      {/* Dynamic Weather Background */}
      <WeatherBackground condition={weatherCondition} isDay={!isNight} />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="w-full">
          <Header
            currentCity={currentCity}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </div>

        {/* Search Bar */}
        <div className="w-full flex justify-center">
          <SearchBar onSelectCity={handleCitySelect} />
        </div>

        {/* Quick Cities - Venezuelan cities */}
        <QuickCities onSelectCity={handleCitySelect} currentCity={currentCity} />

        {/* Error Display */}
        <AnimatePresence mode="wait">
          {hasError && !weatherData && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 sm:mt-8"
            >
              <ErrorDisplay
                message={
                  geoError ||
                  (weatherError instanceof Error ? weatherError.message : 'Error al cargar el clima') ||
                  (forecastError instanceof Error ? forecastError.message : '')
                }
                type={geoError ? 'location' : 'api'}
                onRetry={handleRefresh}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather Content */}
        <AnimatePresence mode="wait">
          {weatherData && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Current Weather */}
              <CurrentWeather data={weatherData} />

              {/* Weather Summary */}
              <WeatherSummary 
                weatherData={weatherData} 
                forecastData={forecastData ?? null} 
              />

              {/* Temperature Chart */}
              {forecastData && (
                <TemperatureChart data={forecastData.list} />
              )}

              {/* Hourly Forecast */}
              {forecastData && (
                <HourlyForecast data={forecastData.list} />
              )}

              {/* 5-Day Forecast */}
              {forecastData && (
                <Forecast data={forecastData} />
              )}

              {/* Air Quality */}
              <AirQuality 
                data={airQualityData as any} 
                isLoading={isAirQualityLoading} 
              />

              {/* Weather Details */}
              <WeatherDetails data={weatherData} />

              {/* Favorites List */}
              <FavoritesList onSelectCity={handleFavoriteSelect} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 sm:mt-12 pb-4 text-center text-white/40 text-xs sm:text-sm"
        >
          <p>
            Datos proporcionados por{' '}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white underline"
            >
              OpenWeatherMap
            </a>
          </p>
          <p className="mt-1">
            <span className="text-yellow-400/60">Clima</span><span className="text-blue-400/60">Vzla</span> © {new Date().getFullYear()} • Hecho con ❤️ en Venezuela 🇻🇪
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

// Wrap with QueryClientProvider
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherApp />
    </QueryClientProvider>
  );
}
