
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3e16fd924ba04ac1a61605bfe6b5cb5f',
  appName: 'CoinMiner Pro',
  webDir: 'dist',
  server: {
    url: 'https://3e16fd92-4ba0-4ac1-a616-05bfe6b5cb5f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#7C3AED',
      showSpinner: false
    }
  }
};

export default config;
