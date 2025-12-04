import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FavoriteCity, City, WeatherSettings, TemperatureUnit, Language } from '../types';

interface WeatherStore {
  // Current location
  currentCity: City | null;
  setCurrentCity: (city: City) => void;

  // Favorites
  favorites: FavoriteCity[];
  addFavorite: (city: City) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (name: string, country: string) => boolean;

  // Settings
  settings: WeatherSettings;
  updateSettings: (settings: Partial<WeatherSettings>) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setLanguage: (lang: Language) => void;

  // Search history
  searchHistory: string[];
  addToHistory: (query: string) => void;
  clearHistory: () => void;

  // UI State
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      // Current location
      currentCity: null,
      setCurrentCity: (city) => set({ currentCity: city }),

      // Favorites
      favorites: [],
      addFavorite: (city) =>
        set((state) => ({
          favorites: [
            ...state.favorites,
            {
              id: `${city.name}-${city.country}-${Date.now()}`,
              name: city.name,
              country: city.country,
              lat: city.lat,
              lon: city.lon,
              addedAt: Date.now(),
            },
          ],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),
      isFavorite: (name, country) => {
        const { favorites } = get();
        return favorites.some(
          (f) => f.name.toLowerCase() === name.toLowerCase() && f.country === country
        );
      },

      // Settings
      settings: {
        temperatureUnit: 'celsius',
        language: 'es',
        autoRefresh: true,
        soundEffects: false,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      setTemperatureUnit: (unit) =>
        set((state) => ({
          settings: { ...state.settings, temperatureUnit: unit },
        })),
      setLanguage: (lang) =>
        set((state) => ({
          settings: { ...state.settings, language: lang },
        })),

      // Search history
      searchHistory: [],
      addToHistory: (query) =>
        set((state) => {
          const history = [query, ...state.searchHistory.filter((h) => h !== query)].slice(0, 10);
          return { searchHistory: history };
        }),
      clearHistory: () => set({ searchHistory: [] }),

      // UI State
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
    }),
    {
      name: 'weather-app-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        settings: state.settings,
        searchHistory: state.searchHistory,
        currentCity: state.currentCity,
      }),
    }
  )
);
