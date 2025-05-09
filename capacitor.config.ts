import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.proyectomovil',
  appName: 'proyectomovil',
  webDir: 'dist',
  server: {
    allowNavigation: ['localhost', 'proyectoapilaravel-production.up.railway.app'] 
  },
  ios: {
    // ... 
    handleApplicationNotifications: false
  }
};
 
export default config;

