<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { CanalPusherProyecto } from '@/services/pusherProyectos'; 
import { watch } from 'vue';
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/vue';


const titulo = ref('');
const id = ref('');
const proyectos = ref<{ id: number; titulo: string; created_by: number; updated_at: string; created_at: string }[]>([]);
const router = useRouter();
const colaboradoresSeleccionados = ref<any>([]);
  const users = ref<any>([]);
const usersLoaded = ref(false);

const getUsers = async () => {
  try {
    const response = await api.get('/usuarios');
    users.value = response.data;
    usersLoaded.value = true;
    console.log('Usuarios obtenidos:', users.value);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
  }
};

getUsers();
let unsubscribeProyecto: (() => void) | null = null;
const modalAbierto = ref(false);
const modalVisible = ref(false);
const proyectoSeleccionado = ref<number | null>(null);
const tituloEditado = ref('');
const modalStyle = ref({ top: '0px', left: '0px' });

const abrirModal = (id: number, titulo: string, event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement;
  const rect = button.getBoundingClientRect();
  
  modalStyle.value = {
    top: `${rect.top + window.scrollY - 50}px`,  
    left: `${rect.left + window.scrollX - 50}px`, 
  };


  proyectoSeleccionado.value = id;
  tituloEditado.value = titulo;
  modalVisible.value = true;
};

const cerrarModal = () => {
  modalVisible.value = false;
};

const guardarCambios = async () => {
  const idsSeleccionados = colaboradoresSeleccionados.value

console.log(`IDs seleccionados: ${idsSeleccionados}`);
  try {
    await api.post(`/proyectos/${proyectoSeleccionado.value}/asignar-usuario`, {
      
    usuario_id: idsSeleccionados,
    });
    const proyecto = proyectos.value.find(p => p.id === proyectoSeleccionado.value);
    if (proyecto) proyecto.titulo = tituloEditado.value;
    cerrarModal();
    alert('Proyecto actualizado correctamente');
  } catch (error) {
    alert('Error al actualizar el proyecto');
    console.error(error);
  }
};



const crearProyecto = async () => {
  try {
    const response = await api.post('/proyectos', {
      id: id.value,
      titulo: titulo.value,
    });
    alert('Proyecto creado con éxito!');
    titulo.value = '';
    // router.push('/home'); // Descomentar si deseas redirigir a otra página después de crear el proyecto
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Error al crear proyecto:', JSON.stringify(error.response.data, null, 2));
      alert('Error al crear el proyecto');
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

// Función para editar un proyecto
const editarProyecto = (proyectoId: number) => {
  router.push({ path: '/editar-proyecto', query: { proyectoId } });
};

// Función para eliminar un proyecto
const eliminarProyecto = async (proyectoId: number) => {
  try {
    await api.delete(`/proyectos/${proyectoId}`);
    alert('Proyecto eliminado con éxito!');
    proyectos.value = proyectos.value.filter((p) => p.id !== proyectoId);
  } catch (error: any) {
    alert('Error al eliminar el proyecto');
    console.error('Error al eliminar proyecto:', error);
  }
};

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
      if (nuevoProyecto && nuevoProyecto.id && nuevoProyecto.titulo) {
        alert(`Nuevo proyecto añadido: ${nuevoProyecto.titulo}`);
        proyectos.value.push(nuevoProyecto);
      } else {
        console.error('Evento de Pusher: Datos del proyecto no válidos', evento);
      }
    }
    // Manejar otros eventos como actualizaciones o eliminaciones si es necesario
  });

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
    unsubscribeProyecto(); // Nos desuscribimos del canal de Pusher
  }
});
</script>
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
      <!-- Formulario para crear proyecto -->
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

      <!-- Lista de proyectos -->
      <div class="projects-list">
        <IonCard v-for="proyecto in proyectos" :key="proyecto.id">
          <IonCardHeader>
            <IonCardTitle>{{ proyecto.titulo }}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton fill="clear" color="primary" @click="abrirModal(proyecto.id, proyecto.titulo, $event)">
            Editar
            </IonButton>

            <IonButton fill="clear" color="danger" @click="eliminarProyecto(proyecto.id)">
              Eliminar
            </IonButton>
          </IonCardContent>
        </IonCard>
      </div>
      <IonModal v-if="modalVisible" :is-open="modalVisible" @didDismiss="cerrarModal" class="custom-modal" :style="modalStyle">
        <IonContent class="ion-padding">
          <h2>Editar Proyecto</h2>
          <IonItem>
      <IonLabel>Seleccionar Colaboradores</IonLabel>
      <IonItem v-if="usersLoaded" interface="ion-select">
        <ion-select
          placeholder="Selecciona los colaboradores"
          multiple="true"
          v-model="colaboradoresSeleccionados"
          interface="alert"
        >
          <ion-select-option
            v-for="user in users"
            :key="user.id"
            :value="user.id"
          >
            {{ user.name }}
          </ion-select-option>
        </ion-select>
</IonItem>

    </IonItem>

    <IonInput
      v-model="tituloEditado"
      label="Nuevo título"
      label-placement="floating"
      placeholder="Escribe el nuevo nombre"
      class="input-field"
    />
          <IonButton expand="block" class="boton" @click="guardarCambios">Guardar Cambios</IonButton>
          <IonButton expand="block" fill="outline" color="medium" @click="cerrarModal">Cancelar</IonButton>
        </IonContent>
      </IonModal>
    </IonContent>
  </IonPage>
</template>



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

.projects-list {
  margin-top: 20px;
}

ion-card {
  margin-bottom: 10px;
}
::v-deep(.custom-modal .modal-wrapper) {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-width: 400px;
  margin: auto;
  border-radius: 12px;
}

</style>
