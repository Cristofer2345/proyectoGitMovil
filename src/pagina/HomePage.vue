<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Mi Título</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      
      <IonGrid>
        <IonRow>
          <IonCol v-for="(column, index) in columns" :key="index" :style="{ backgroundColor: getColumnColor(index) }">
            <h3>{{ column.title }}</h3>
            <ul>
             
            </ul>
            <ul>
              <li v-for="(card, cardIndex) in column.cards" :key="cardIndex">{{ card }}</li>
            </ul>
            <button>Editar tarea </button>
          </IonCol>
        </IonRow>
      </IonGrid>
      <ion-content class="ion-padding">
      <ion-button id="open-modal" expand="block">Open</ion-button>
      <modal  @confirmed="handleConfirmed" />
    </ion-content>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol,  IonButtons,
    IonButton,
    IonModal,
    IonItem,
    IonInput, } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import api from '@/services/api';   
import {CanalPusher} from '@/services/pusher';
import modal from '@/pagina/modal.vue';

// Verificar si el token está presente
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/login'; // Redirigir si no está logueado
}

// Estado reactivo para las columnas
const columns = ref<any>([
  { title: "Por hacer", cards: [] },
  { title: "En progreso", cards: [] },
  { title: "Completado", cards: [] }
]);

// Colores para las columnas
const columnColors = ref<string[]>(['#FFCDD2', '#C8E6C9', '#BBDEFB', '#FFF9C4', '#D1C4E9']);

// Función para obtener el color de la columna
const getColumnColor = (index: number): string => columnColors.value[index % columnColors.value.length];

// Función para cargar los datos desde la API
const fetchColumns = async () => {
  try {
    const response = await api.get('/tareas');
    console.log(response.data); // Verifica los datos de la respuesta

    if (response.status !== 200) {
      throw new Error('Error al obtener los datos de la tabla tareas');
    }

    const tareas = response.data;
    if (!Array.isArray(tareas)) {
      throw new Error('La respuesta no es un array de tareas');
    }

    columns.value = [
      {
        title: "Por hacer",
        cards: tareas
          .filter(tarea => tarea.estado === 'pendiente')
          .map(tarea => tarea.titulo_tarea)
      },
      {
        title: "En progreso",
        cards: tareas
          .filter(tarea => tarea.estado === 'en progreso')
          .map(tarea => tarea.titulo_tarea)
      },
      {
        title: "Completado",
        cards: tareas
          .filter(tarea => tarea.estado === 'completada')
          .map(tarea => tarea.titulo_tarea)
      }
    ];
  } catch (error) {
    console.error('Error al obtener los datos de la tabla tareas:', error);
  }
  
};

// Cargar los datos al montar el componente
onMounted(() => {
  fetchColumns();
});
const handleConfirmed = (name: string) => {
  message.value = `Hello, ${name}!`;
};
const message = ref('This modal example uses triggers to automatically open a modal when the button is clicked.');
</script>

