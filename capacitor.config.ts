import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.test.app',
  appName: 'testapp',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
