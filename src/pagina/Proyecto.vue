<template>
  <IonPage>
    <!-- Menú lateral -->
    <IonMenu content-id="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menú</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button @click="router.push('/home')">
            <IonIcon slot="start" name="home-outline" />
            <IonLabel>Inicio</IonLabel>
          </IonItem>
          <IonItem button @click="router.push('/proyectos')">
            <IonIcon slot="start" name="add-circle-outline" />
            <IonLabel>Crear Proyecto</IonLabel>
          </IonItem>
          <IonItem button @click="router.push({ path: '/tareas', query: { proyectoId: id } })">
            <IonIcon slot="start" name="folder-open-outline" />
            <IonLabel>Proyectos</IonLabel>
          </IonItem>
          <IonItem button @click="cerrarSesion">
            <IonIcon slot="start" name="log-out-outline" />
            <IonLabel color="danger">Cerrar Sesión</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>

    <!-- Contenido principal -->
    <div id="main-content">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Crear Proyecto</IonTitle>
        </IonToolbar>
      </IonHeader>
    </div>

    <IonContent class="ion-padding principal">
      <div class="form-container">
        <h2>Nuevo Proyecto</h2>

        <IonInput
          v-model="titulo"
          placeholder="Nombre del proyecto"
          label="Pon el nombre del proyecto aquí"
          label-placement="floating"
          type="text"
          class="input-field"
        />

        <IonButton expand="block" @click="crearProyecto" class="boton">Crear Proyecto</IonButton>
        <IonButton expand="block" fill="outline" color="medium" @click="router.push('/home')" class="boton">
          Volver
        </IonButton>
      </div>

      <div v-if="proyectos.length > 0" class="lista-proyectos">
        <h2>Proyectos existentes:</h2>
        <IonList>
          <IonItem v-for="proyecto in proyectos" :key="proyecto.id">
            <IonLabel>{{ proyecto.titulo }}</IonLabel>
          </IonItem>
        </IonList>
      </div>
    </IonContent>
  </IonPage>
</template>
  
<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { CanalPusherProyecto } from '@/services/pusherProyectos'; // <-- tu archivo TS que me diste

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonMenu,
  IonMenuButton,
  IonButtons,
  IonItem,
  IonList,
  IonIcon,
  IonLabel,
} from '@ionic/vue';

const titulo = ref('');
const id = ref('');
const proyectos = ref<{ id: number; titulo: string; created_by: number; updated_at: string; created_at: string }[]>([]); // <-- nueva lista de proyectos
const router = useRouter();

let unsubscribeProyecto: (() => void) | null = null; // para guardar la función de desuscribirse

const crearProyecto = async () => {
  try {
    const response = await api.post('/proyectos', {
      id: id.value,
      titulo: titulo.value,
    });
    alert('Proyecto creado con éxito');
    titulo.value = ''; // Limpia el input
    router.push('/home');
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Error al crear proyecto:', JSON.stringify(error.response.data, null, 2));
      alert( 'Error al crear el proyecto');
    } else {
      console.error('Error al crear proyecto:', error.message);
      alert('Error inesperado al crear el proyecto');
    }
  }
};

const cerrarSesion = () => {
  localStorage.removeItem('token');
  router.push('/welcome');
};

// Función para cerrar el menú
const closeMenu = () => {
  const menu = document.querySelector('ion-menu');
  if (menu) {
    menu.close();
  }
};

onMounted(async () => {
  alert('Bienvenido a la página de creación de proyectos!');
  unsubscribeProyecto = CanalPusherProyecto((evento) => {
    alert(`Nuevo evento de Pusher: ${evento.accion}`);
    if (evento.accion === 'añadido') {
      const nuevoProyecto = evento.proyecto;
      // Validamos que el proyecto tenga la estructura correcta
      if (nuevoProyecto && nuevoProyecto.id && nuevoProyecto.titulo) {
        alert(`Nuevo proyecto añadido: ${nuevoProyecto.titulo}`);
        proyectos.value.push(nuevoProyecto); // Agrega el nuevo proyecto en la lista
      } else {
        console.error('Evento de Pusher: Datos del proyecto no válidos', evento);
      }
    }
    // Podrías aquí manejar actualizaciones o eliminaciones también si quieres
  });

  // (opcional) Puedes traer los proyectos ya creados si quieres mostrar una lista inicial
  try {
    const response = await api.get('/proyectos');
    proyectos.value = response.data;
  } catch (error) {
    console.error('Error al cargar proyectos', error);
  }

  nextTick(() => {
    window.addEventListener('ionRouteDidChange', closeMenu);
  });
});

onUnmounted(() => {
  window.removeEventListener('ionRouteDidChange', closeMenu);
  if (unsubscribeProyecto) {
    unsubscribeProyecto(); // nos desuscribimos del canal de pusher
  }
});

// INTERFAZ para los proyectos
interface ProyectoEventoTimeReal {
  proyecto: {
    id: number;
    titulo: string;
    created_by: number;
    updated_at: string;
    created_at: string;
  };
  accion: 'añadido' | 'actualizado' | 'eliminado';
}
</script>

  
<style scoped>
  .principal {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  .form-container {
    width: 100%;
    max-width: 400px;
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    text-align: center;
  }
  
  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }
  
  .input-field {
    margin-bottom: 20px;
  }
  
  .boton {
    margin-top: 10px;
  }
</style>
  