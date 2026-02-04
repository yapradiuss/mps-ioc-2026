"use client";

import { useEffect, useRef, useState } from "react";

interface WeatherWidgetProps {
  onVisibilityChange?: (visible: boolean) => void;
  defaultVisible?: boolean;
  initialSize?: { width: number; height: number };
}

// Global script loading state
let weatherScriptLoaded = false;
let weatherScriptLoading = false;

// Function to load weatherwidget.io script
const loadWeatherScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If script is already loaded, resolve immediately
    if (weatherScriptLoaded) {
      resolve();
      return;
    }

    // If script is currently loading, wait for it
    if (weatherScriptLoading) {
      const checkInterval = setInterval(() => {
        if (weatherScriptLoaded) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!weatherScriptLoaded) {
          reject(new Error('Script loading timeout'));
        }
      }, 10000);
      return;
    }

    // Check if script already exists in DOM
    const existingScript = document.getElementById('weatherwidget-io-js') as HTMLScriptElement;
    if (existingScript) {
      if (weatherScriptLoaded) {
        resolve();
        return;
      }
      existingScript.addEventListener('load', () => {
        weatherScriptLoaded = true;
        resolve();
      }, { once: true });
      
      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load weather widget script'));
      }, { once: true });
      return;
    }

    // Create and load new script using the weatherwidget.io loader pattern
    weatherScriptLoading = true;
    const script = document.createElement('script');
    script.id = 'weatherwidget-io-js';
    script.src = 'https://weatherwidget.io/js/widget.min.js';
    script.async = true;

    script.onload = () => {
      weatherScriptLoaded = true;
      weatherScriptLoading = false;
      setTimeout(() => {
        resolve();
      }, 500);
    };

    script.onerror = () => {
      weatherScriptLoading = false;
      script.remove();
      reject(new Error('Failed to load weather widget script'));
    };

    // Use the exact pattern from weatherwidget.io
    const fjs = document.getElementsByTagName('script')[0];
    if (fjs && fjs.parentNode) {
      fjs.parentNode.insertBefore(script, fjs);
    } else {
      document.body.appendChild(script);
    }
  });
};

export default function WeatherWidget({ 
  onVisibilityChange,
  defaultVisible = true,
  initialSize,
}: WeatherWidgetProps) {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const anchorCreatedRef = useRef(false);

  useEffect(() => {
    if (!widgetContainerRef.current) {
      return;
    }

    // Check if widget already exists
    const existingAnchor = widgetContainerRef.current.querySelector('a.weatherwidget-io');
    if (existingAnchor) {
      setIsLoading(false);
      return;
    }

    const initWidget = async () => {
      if (!widgetContainerRef.current || anchorCreatedRef.current) {
        return;
      }

      try {
        // Create the anchor element with weatherwidget.io attributes
        const anchor = document.createElement('a');
        anchor.className = 'weatherwidget-io';
        anchor.href = 'https://forecast7.com/en/2d69101d75/sepang/';
        anchor.setAttribute('data-label_1', 'SEPANG');
        anchor.setAttribute('data-label_2', 'WEATHER');
        anchor.setAttribute('data-theme', 'original');
        anchor.textContent = 'SEPANG WEATHER';

        widgetContainerRef.current.appendChild(anchor);
        anchorCreatedRef.current = true;

        // Load the weatherwidget.io script
        await loadWeatherScript();
        
        setIsLoading(false);
        setError(null);
      } catch (err: any) {
        console.error('Error initializing weather widget:', err);
        setError('Failed to load weather widget');
        setIsLoading(false);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initWidget, 50);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="w-full h-full min-h-0 flex flex-col">
      <div 
        ref={widgetContainerRef}
        className="w-full flex-1 min-h-0 relative"
        style={{ 
          minHeight: 120,
          display: 'block',
          overflow: 'hidden'
        }}
      >
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-sm rounded-lg">
            <div className="text-white/70 text-sm text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/70"></div>
                <span>Loading weather...</span>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-400 text-sm text-center py-8">
            <div className="flex flex-col items-center gap-2">
              <span>{error}</span>
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  anchorCreatedRef.current = false;
                  if (widgetContainerRef.current) {
                    const existingAnchor = widgetContainerRef.current.querySelector('a.weatherwidget-io');
                    if (existingAnchor) {
                      existingAnchor.remove();
                    }
                  }
                  weatherScriptLoaded = false;
                  weatherScriptLoading = false;
                  // Trigger re-initialization
                  const timer = setTimeout(() => {
                    if (widgetContainerRef.current) {
                      const anchor = document.createElement('a');
                      anchor.className = 'weatherwidget-io';
                      anchor.href = 'https://forecast7.com/en/2d69101d75/sepang/';
                      anchor.setAttribute('data-label_1', 'SEPANG');
                      anchor.setAttribute('data-label_2', 'WEATHER');
                      anchor.setAttribute('data-theme', 'original');
                      anchor.textContent = 'SEPANG WEATHER';
                      widgetContainerRef.current.appendChild(anchor);
                      anchorCreatedRef.current = true;
                      loadWeatherScript().then(() => {
                        setIsLoading(false);
                        setError(null);
                      }).catch(() => {
                        setError('Failed to load weather widget');
                        setIsLoading(false);
                      });
                    }
                  }, 100);
                }}
                className="text-xs underline hover:text-red-300 mt-2 px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

