import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let isInitialized = false;

export const initGA = () => {
  if (isInitialized) return;
  
  try {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    isInitialized = true;
    console.log('GA initialized successfully with ID:', GA_MEASUREMENT_ID);
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
  }
};

export const logPageView = (path?: string) => {
  if (!isInitialized) {
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

export const logEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
  nonInteraction?: boolean
) => {
  try {
    ReactGA.event({
      category,
      action,
      label,
      value,
      nonInteraction
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

export const logTiming = (
  category: string,
  variable: string,
  value: number,
  label?: string
) => {
  try {
    logEvent('Timing', `${category} - ${variable}`, label, value);
  } catch (error) {
    console.error('Failed to track timing:', error);
  }
};

export const trackException = (description: string, fatal: boolean = false) => {
  try {
    logEvent('Exception', description, fatal ? 'Fatal' : 'Non-Fatal');
  } catch (error) {
    console.error('Failed to track exception:', error);
  }
};

