import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import  OneSignal   from 'onesignal-cordova-plugin';
import { ref } from 'vue';
const app = createApp(App)
  .use(IonicVue)
  .use(router);

const isLoading = ref(true);

router.isReady().then(async () => {
  app.mount('#app');
  /*
  // Inicializar OneSignal
  OneSignal.initialize('0e02f2e5-3fa7-4055-9167-ad6629546d6f');

  const waitForId = async (): Promise<string> => {
    return new Promise((resolve) => {
      const checkId = async () => {
        const id = await OneSignal.User.getOnesignalId();
        if (id) {
          resolve(id);
        } else {
          setTimeout(checkId, 1000);
        }
      };
      checkId();
    });
  };

  // Pedir permiso de notificaciones
  await OneSignal.Notifications.requestPermission();

  // Esperar a obtener el OneSignal ID
  const oneSignalId = await waitForId();
  console.log('OneSignal ID:', oneSignalId);

  // Guardarlo en localStorage
  localStorage.setItem('SubscriptionId', oneSignalId);

  // Cambiar el estado de carga y redirigir al login
  isLoading.value = false;
  router.push('/welcome');

  // Chequeo periódico del ID (opcional, cada 1 minuto)
  const interval = setInterval(async () => {
    const id = await OneSignal.User.getOnesignalId();
    console.log('OneSignal ID (check):', id);
    if (id) {
      clearInterval(interval);
    }
  }, 60000);
*/
});
// Add a loading screen component or logic in your App.vue to display based on `isLoading`


