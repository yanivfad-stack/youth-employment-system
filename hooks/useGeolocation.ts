'use client';

import { useState, useEffect, useCallback } from 'react';

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface GeolocationState {
  coordinates: GeolocationCoordinates | null;
  error: string | null;
  loading: boolean;
  supported: boolean;
}

/**
 * Custom hook for accessing browser geolocation
 * Provides current position with accuracy and timestamp
 *
 * @example
 * const { coordinates, error, loading, supported, getCurrentPosition } = useGeolocation();
 * const position = await getCurrentPosition();
 */
export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: false,
    supported: typeof navigator !== 'undefined' && !!navigator.geolocation,
  });

  const getCurrentPosition = useCallback(
    async (): Promise<GeolocationCoordinates | null> => {
      if (!state.supported) {
        setState((prev) => ({
          ...prev,
          error: 'הדפדפן שלך אינו תומך בגיאולוקציה',
        }));
        return null;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const coordinates: GeolocationCoordinates = {
              latitude,
              longitude,
              accuracy,
              timestamp: Date.now(),
            };

            setState((prev) => ({
              ...prev,
              coordinates,
              error: null,
              loading: false,
            }));

            resolve(coordinates);
          },
          (error) => {
            let errorMessage = 'לא ניתן לקבל את המיקום שלך';

            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage =
                  'הרשאת מיקום נדחתה. אנא הפוך אותה בהגדרות הדפדפן שלך.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'מידע המיקום אינו זמין.';
                break;
              case error.TIMEOUT:
                errorMessage = 'תם זמן הבקשה לקבל מיקום.';
                break;
            }

            setState((prev) => ({
              ...prev,
              error: errorMessage,
              loading: false,
            }));

            resolve(null);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000, // 15 seconds
            maximumAge: 0, // Don't use cached position
          }
        );
      });
    },
    [state.supported]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    coordinates: state.coordinates,
    error: state.error,
    loading: state.loading,
    supported: state.supported,
    getCurrentPosition,
    clearError,
  };
};
