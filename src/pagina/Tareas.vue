<script lang="ts" setup>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonMenu,
  IonMenuButton,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
} from '@ionic/vue';
import { ref, onMounted,onUnmounted,nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import modal from '@/pagina/modal.vue';
import { CanalPusher } from '@/services/pusher';

const router = useRouter();
const proyectoId = router.currentRoute.value.query.id;
const irACrearProyecto = () => {
  router.push('/proyectos');
};

const irAProyectos = () => {
  router.push('/tareas');
};

const cerrarSesion = () => {
  localStorage.removeItem('token');
  router.push('/welcome');
};

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/login';
}

const columns = ref<any>([
  { title: 'Por hacer', cards: [] },
  { title: 'En progreso', cards: [] },
  { title: 'Completado', cards: [] },
]);
type column = {
  title: string;
  cards: string[];
};
const columnColors = ref<string[]>(['#0079BF', '#F2D600', '#61BD4F']); // Azul, Amarillo, Verde

const getColumnColor = (index: number): string =>
  columnColors.value[index % columnColors.value.length];

const fetchColumns = async () => {
  try {
    const response = await api.get(`/tareas/proyecto/${proyectoId}`);
    if (response.status !== 200) {
      throw new Error('Error al obtener los datos de la tabla tareas');
    }

    const tareas = response.data;
    if (!Array.isArray(tareas)) {
      throw new Error('La respuesta no es un array de tareas');
    }

    columns.value = [
      {
        title: 'Por hacer',
        cards: tareas
          .filter((tarea) => tarea.estado === 'pendiente')
          .map((tarea) => tarea.titulo_tarea),
      },
      {
        title: 'En progreso',
        cards: tareas
          .filter((tarea) => tarea.estado === 'en progreso')
          .map((tarea) => tarea.titulo_tarea),
      },
      {
        title: 'Completado',
        cards: tareas
          .filter((tarea) => tarea.estado === 'completada')
          .map((tarea) => tarea.titulo_tarea),
      },
    ];
  } catch (error) {
    console.error('Error al obtener los datos de la tabla tareas:', error);
  }
};

const closeMenu = () => {
  const menu = document.querySelector('ion-menu');
  if (menu) {
    menu.close(); // Cierra el menú cuando cambia de página
  }
};
const unsubscribe = ref<() => void>(); 
onMounted(() => {
  fetchColumns();
  unsubscribe.value = CanalPusher(proyectoId, (data: any) => {
    alert('Tarea actualizada');
    console.log("Tarea actualizada recibida:", data);

    // Elimina la tarea de todas las columnas
    columns.value.forEach((column: column) => {
      column.cards = column.cards.filter((titulo: string) => titulo !== data.titulo_tarea);
    });

    const estado: string = data.estado;
    let targetColumn;

    if (estado === 'pendiente') {
      targetColumn = columns.value.find((col: column) => col.title === 'Por hacer');
    } else if (estado === 'en progreso') {
      targetColumn = columns.value.find((col: column) => col.title === 'En progreso');
    } else if (estado === 'completada') {
      targetColumn = columns.value.find((col: column) => col.title === 'Completado');
    }

    if (targetColumn) {
      targetColumn.cards.push(data.titulo_tarea);
    }
});
  alert("Este es el id del proyecto: " + proyectoId);
   // Aseguramos que el menú se cierre después de cada cambio de ruta
   nextTick(() => {
    window.addEventListener('ionRouteDidChange', closeMenu);
  });

  // Limpiar el evento cuando se desmonta el componente
  onUnmounted(() => {
    window.removeEventListener('ionRouteDidChange', closeMenu);
  });
});

const handleConfirmed = (name: string) => {
  message.value = `Hello, ${name}!`;
};
const message = ref(
  'This modal example uses triggers to automatically open a modal when the button is clicked.'
);
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
            <IonIcon slot="start" name="add-circle-outline"></IonIcon>
            <IonLabel>Crear Proyecto</IonLabel>
          </IonItem>
          <IonItem button @click="irAProyectos">
            <IonIcon slot="start" name="folder-open-outline"></IonIcon>
            <IonLabel>Proyectos</IonLabel>
          </IonItem>
          <IonItem button @click="cerrarSesion">
            <IonIcon slot="start" name="log-out-outline"></IonIcon>
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
      <IonTitle>Espacio de trabajo</IonTitle>
    </IonToolbar>
  </IonHeader>
  </div>

      <IonContent class="ion-padding">
        <IonGrid class="custom-grid">
          <IonRow class="custom-row">
            <IonCol
              v-for="(column, index) in columns"
              :key="index"
              size="12"
              size-md="3"
              class="column-card"
              :style="{ backgroundColor: getColumnColor(index) }"
            >
              <div class="column-content">
                <h3>{{ column.title }}</h3>
                <ul>
                  <li v-for="(card, cardIndex) in column.cards" :key="cardIndex">
                    {{ card }}
                  </li>
                </ul>
                <IonButton expand="full" color="light" class="edit-button">
                  Editar tarea
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonButton id="open-modal" expand="block" class="open-modal-button">
          Open
        </IonButton>
        <modal :miVariable="parseInt(proyectoId?.toString() || '0')"  @confirmed="handleConfirmed" />
      </IonContent>
    
  </IonPage>
  
</template>

<style scoped>
.custom-grid {
  padding: 16px;
}

.custom-row {
  justify-content: center;
  gap: 16px;
}

.column-card {
  padding: 10px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
  overflow: hidden;
}

.column-card:hover {
  transform: translateY(-5px);
}

.column-content {
  text-align: center;
}

.column-content h3 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: rgb(255, 252, 252);
}

.column-content ul {
  list-style-type: none;
  padding: 0;
  margin-bottom: 1rem;
}

.column-content li {
  background: rgba(8, 8, 8, 0.85);
  margin: 8px 0;
  padding: 12px;
  border-radius: 10px;
  font-weight: 500;
}

.edit-button {
  --border-radius: 10px;
  --background: white;
  --color: #333;
}

.open-modal-button {
  margin-top: 20px;
}
</style>