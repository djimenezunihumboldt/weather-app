import axios from 'axios';
import type { WeatherData, ForecastData, GeocodingResult } from '../types';

// OpenWeather API Key - Free tier
const API_KEY = '4d8fb5b93d4af21d66a2948710284366';
const BASE_URL = 'https://api.openweathermap.org';

// Create axios instance with default config
const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Get current weather by coordinates
 */
export const getCurrentWeather = async (
  lat: number,
  lon: number,
  lang: string = 'es'
): Promise<WeatherData> => {
  const response = await weatherApi.get<WeatherData>('/data/2.5/weather', {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
      lang,
    },
  });
  return response.data;
};

/**
 * Get current weather by city name
 */
export const getWeatherByCity = async (
  city: string,
  lang: string = 'es'
): Promise<WeatherData> => {
  const response = await weatherApi.get<WeatherData>('/data/2.5/weather', {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
      lang,
    },
  });
  return response.data;
};

/**
 * Get 5-day forecast by coordinates
 */
export const getForecast = async (
  lat: number,
  lon: number,
  lang: string = 'es'
): Promise<ForecastData> => {
  const response = await weatherApi.get<ForecastData>('/data/2.5/forecast', {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
      lang,
    },
  });
  return response.data;
};

/**
 * Search cities by name (Geocoding API)
 */
export const searchCities = async (
  query: string,
  limit: number = 5
): Promise<GeocodingResult[]> => {
  const response = await weatherApi.get<GeocodingResult[]>('/geo/1.0/direct', {
    params: {
      q: query,
      limit,
      appid: API_KEY,
    },
  });
  return response.data;
};

/**
 * Reverse geocoding - get city name from coordinates
 */
export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<GeocodingResult[]> => {
  const response = await weatherApi.get<GeocodingResult[]>('/geo/1.0/reverse', {
    params: {
      lat,
      lon,
      limit: 1,
      appid: API_KEY,
    },
  });
  return response.data;
};

/**
 * Get weather icon URL
 */
export const getWeatherIconUrl = (icon: string, size: '2x' | '4x' = '4x'): string => {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
};

/**
 * Get Air Quality Index (if needed in future)
 */
export const getAirQuality = async (lat: number, lon: number) => {
  const response = await weatherApi.get('/data/2.5/air_pollution', {
    params: {
      lat,
      lon,
      appid: API_KEY,
    },
  });
  return response.data;
};
