
import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.393e33a5fcc04306b59ce95d88d48c0a',
  appName: 'Tic Tac Toe',
  webDir: 'dist',
  server: {
    url: 'https://393e33a5-fcc0-4306-b59c-e95d88d48c0a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B5CF6'
    }
  }
};

export default config;
