import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.camptrade.app',
  appName: 'CampTrade',
  webDir: 'mobile-app',
  server: {
    url: 'https://camp-trade.vercel.app',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark'
    }
  }
};

export default config;
