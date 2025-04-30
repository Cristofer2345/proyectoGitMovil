<script lang="ts" setup>
import {
  IonPage,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonMenuButton,
  IonButtons,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
} from '@ionic/vue';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { CanalPusher } from '@/services/pusher';
import { CanalPusherProyecto } from '@/services/pusherProyectos'; // ← AÑADIDO

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/login'; 
}

// Router para navegar
const router = useRouter();

// Nombre del usuario (lo puedes traer del token si quieres)
const nombreUsuario = ref('Usuario');

// Proyectos del usuario
const proyectos = ref<any[]>([]);

// Funciones para ir a otras páginas
const irACrearProyecto = () => {
  router.push('/proyectos');
};

const irTareas = (id: any) => {
  router.push({ path: '/tareas', query: { id } });
};

const cerrarSesion = () => {
  localStorage.removeItem('token');
  router.push('/welcome');
};

// Función para obtener los proyectos
const fetchProyectos = async () => {
  try {
    const response = await api.get('/proyectos');
    if (response.status !== 200) {
      throw new Error('Error al obtener los proyectos');
    }

    const proyectosDATA = response.data;
    if (!Array.isArray(proyectosDATA)) {
      throw new Error('La respuesta no es un array de proyectosDATA');
    }

    proyectos.value = proyectosDATA.map((proyecto) => ({
      id: proyecto.id,              
      nombre: proyecto.titulo,     
    }));
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
  }
};

// Función para cerrar el menú
const closeMenu = () => {
  const menu = document.querySelector('ion-menu');
  if (menu) {
    menu.close(); 
  }
};

const unsubscribe = ref<() => void>(); 
let unsubscribeProyecto: (() => void) | null = null; // ← AÑADIDO

onMounted(() => {
  fetchProyectos().then(() => {
    proyectos.value.forEach((proyecto) => {
      unsubscribe.value = CanalPusher(proyecto.id, (data: any) => {
        alert(`Tarea actualizada en el proyecto ${proyecto.nombre}`);
        console.log(`Tarea actualizada recibida en el proyecto ${proyecto.nombre}:`, data);
      });
    });
  });

  unsubscribeProyecto = CanalPusherProyecto((evento) => {
    if (evento.accion === 'añadido') {
      const nuevoProyecto = evento.proyecto;
      if (!proyectos.value.some(p => p.id === nuevoProyecto.id)) {
        proyectos.value.push({
          id: nuevoProyecto.id,
          nombre: nuevoProyecto.titulo,
        });
      }
    }
  });

  nextTick(() => {
    window.addEventListener('ionRouteDidChange', closeMenu);
  });
});

onUnmounted(() => {
  window.removeEventListener('ionRouteDidChange', closeMenu);
  if (unsubscribeProyecto) {
    unsubscribeProyecto(); // ← Desuscribirse del canal
  }
});
</script>


<template>
  <IonPage>
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
          <IonItem button @click="irACrearProyecto">
            <IonIcon slot="start" name="add-circle-outline" />
            <IonLabel>Crear Proyecto</IonLabel>
          </IonItem>
          <IonItem button @click="irTareas">
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

    <div id="main-content">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Inicio</IonTitle>
        </IonToolbar>
      </IonHeader>
    </div>
      <IonContent class="ion-padding">
        <div class="bienvenida">
          <h1>¡Bienvenido, {{ nombreUsuario }}!</h1>
          <p>Estos son tus proyectos:</p>
        </div>

        <IonGrid>
          <IonRow class="ion-justify-content-start" style="gap: 16px;">
            <IonCol
              v-for="proyecto in proyectos"
              :key="proyecto.id"
              size="12"
              size-md="4"
              size-lg="3"
            >
              <IonCard class="proyecto-card" @click="irTareas(proyecto.id)">
                <IonCardHeader>
                  <IonCardTitle>{{ proyecto.nombre }}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{{ proyecto.descripcion }}</p>
                  <small>Suscrito al proyecto : {{ proyecto.id }}</small>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    
  </IonPage>
</template>

<style scoped>
.bienvenida {
  text-align: center;
  margin-bottom: 20px;
}

.bienvenida h1 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.bienvenida p {
  font-size: 1.2rem;
  color: #666;
}

.proyecto-card {
  transition: transform 0.2s;
  cursor: pointer;
}

.proyecto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}
</style>


