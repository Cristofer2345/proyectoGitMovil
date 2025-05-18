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
import modalEdit from '@/pagina/ModalEditarTarea.vue'; 
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
const tareaSeleccionada = ref<any>(null);

const columnColors = ref<string[]>(['#E3E3E3', '#F5F5F5', '#D4F4DD']); 

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
    cards: tareas.filter((tarea) => tarea.estado === 'pendiente'),
  },
  {
    title: 'En progreso',
    cards: tareas.filter((tarea) => tarea.estado === 'en progreso'),
  },
  {
    title: 'Completado',
    cards: tareas.filter((tarea) => tarea.estado === 'completada'),
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
// ... todo tu código anterior permanece igual hasta aquí ...

onMounted(() => {
  fetchColumns();
  unsubscribe.value = CanalPusher(proyectoId, (data: { tarea: any; accion: string }) => {
    console.log("Evento recibido:", data);

    const { tarea, accion } = data;

    if (accion === 'añadido') {
      // Agregar la tarea a la columna correspondiente
      const targetColumn = columns.value.find((col: column) => {
        return col.title === (tarea.estado === 'pendiente'
          ? 'Por hacer'
          : tarea.estado === 'en progreso'
          ? 'En progreso'
          : 'Completado');
      });

      if (targetColumn) {
        targetColumn.cards.push(tarea);
        alert('Nueva tarea añadida: ' + tarea.titulo_tarea);
      }
    } else if (accion === 'actualizado') {
      // Actualizar la tarea en la columna correspondiente
      columns.value.forEach((column: column) => {
        const tareaIndex = column.cards.findIndex((card: any) => card.id === tarea.id);
        if (tareaIndex !== -1) {
          column.cards.splice(tareaIndex, 1);
        }
      });

      const targetColumn = columns.value.find((col: column) => {
        return col.title === (tarea.estado === 'pendiente'
          ? 'Por hacer'
          : tarea.estado === 'en progreso'
          ? 'En progreso'
          : 'Completado');
      });

      if (targetColumn) {
        targetColumn.cards.push(tarea);
        alert('Tarea actualizada: ' + tarea.titulo_tarea);
      }
    } else if (accion === 'eliminado') {
      // Eliminar la tarea de todas las columnas
      columns.value.forEach((column: column) => {
        column.cards = column.cards.filter((card: any) => card.id !== tarea.id);
      });
      alert('Tarea eliminada: ' + tarea.titulo_tarea);
    } else {
      console.error('Acción desconocida:', accion);
    }
  });

  

  nextTick(() => {
    window.addEventListener('ionRouteDidChange', closeMenu);
  });

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
const editarTarea = (tarea: any) => {
  tareaSeleccionada.value = tarea;
  const modalElement = document.getElementById('open-modalEditTask');
  modalElement?.click();
};



const eliminarTarea = async (id: number) => {
  try {
    await api.delete(`/tareas/${id}`);

    // Eliminar la tarea de todas las columnas localmente
    columns.value.forEach((column: column) => {
      column.cards = column.cards.filter((tarea: any) => tarea.id !== id);
    });

  } catch (error) {
    console.error('Error al eliminar tarea:', error);
  }
};



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
                    <li v-for="(card, cardIndex) in column.cards" :key="cardIndex" class="tarea-card">
                      <div>{{ card.titulo_tarea }}</div>
                      <IonButton size="small" color="warning" @click="editarTarea(card)">
                        Editar
                      </IonButton>
                         <modalEdit :miVariableEditTask="parseInt(proyectoId?.toString() || '0')"  @confirmed="handleConfirmed" />
                      <IonButton size="small" color="danger" @click="eliminarTarea(card.id)">
                        Eliminar
                      </IonButton>
                    </li>
                  </ul>


               
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonButton id="open-modal" class="floating-button" color="primary">
  Crear
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
.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  border-radius: 50px;
  padding: 12px 20px;
}
.tarea-card {
  background: rgba(255, 255, 255, 0.9);
  margin: 8px 0;
  padding: 12px;
  border-radius: 10px;
  font-weight: 500;
  color: #000;
}


</style>