// Weather API Types
export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: WeatherCondition[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    '3h'?: number;
  };
  snow?: {
    '3h'?: number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// App Types
export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: number;
}

export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  theme: 'auto' | 'light' | 'dark';
  language: 'es' | 'en';
}

// UI Types
export type WeatherTheme = 'clear-day' | 'clear-night' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy';

export type WeatherConditionType = 'clear' | 'clouds' | 'rain' | 'drizzle' | 'thunderstorm' | 'snow' | 'mist' | 'fog' | 'haze' | 'dust' | 'smoke';

export type Language = 'es' | 'en';

export interface DailyForecast {
  date: Date;
  tempMin: number;
  tempMax: number;
  icon: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pop: number;
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

export interface WeatherSettings {
  temperatureUnit: TemperatureUnit;
  language: Language;
  autoRefresh: boolean;
  soundEffects: boolean;
}

