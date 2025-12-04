import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { getCurrentWeather, getForecast, searchCities, reverseGeocode } from '../services';
import type { WeatherData, ForecastData, GeocodingResult, Language } from '../types';

/**
 * Hook to fetch current weather data
 */
export const useCurrentWeather = (
  lat: number,
  lon: number,
  language: Language = 'es',
  options?: Partial<UseQueryOptions<WeatherData>>
) => {
  return useQuery({
    queryKey: ['currentWeather', lat, lon, language],
    queryFn: () => getCurrentWeather(lat, lon, language),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
};

/**
 * Hook to fetch 5-day forecast
 */
export const useForecast = (
  lat: number,
  lon: number,
  language: Language = 'es',
  options?: Partial<UseQueryOptions<ForecastData>>
) => {
  return useQuery({
    queryKey: ['forecast', lat, lon, language],
    queryFn: () => getForecast(lat, lon, language),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
};

/**
 * Hook to search cities
 */
export const useSearchCities = (query: string, limit: number = 5) => {
  return useQuery({
    queryKey: ['searchCities', query, limit],
    queryFn: () => searchCities(query, limit),
    enabled: query.length >= 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook for reverse geocoding
 */
export const useReverseGeocode = (lat: number | null, lon: number | null) => {
  return useQuery({
    queryKey: ['reverseGeocode', lat, lon],
    queryFn: () => reverseGeocode(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Hook to get user's geolocation
 */
export const useGeolocation = () => {
  const [location, setLocation] = useState<GeocodingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada en este navegador');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      const { latitude: lat, longitude: lon } = position.coords;
      
      // Get city name from coordinates
      const results = await reverseGeocode(lat, lon);
      
      if (results && results.length > 0) {
        setLocation(results[0]);
        return results[0];
      } else {
        // Return coordinates even if reverse geocoding fails
        const fallbackLocation: GeocodingResult = {
          name: 'Tu ubicación',
          lat,
          lon,
          country: '',
        };
        setLocation(fallbackLocation);
        return fallbackLocation;
      }
    } catch (err) {
      const errorMessage = err instanceof GeolocationPositionError
        ? getGeolocationErrorMessage(err)
        : 'Error al obtener la ubicación';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { location, error, isLoading, requestLocation };
};

// Helper function for geolocation errors
function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Permiso de ubicación denegado';
    case error.POSITION_UNAVAILABLE:
      return 'Ubicación no disponible';
    case error.TIMEOUT:
      return 'Tiempo de espera agotado';
    default:
      return 'Error desconocido';
  }
}
