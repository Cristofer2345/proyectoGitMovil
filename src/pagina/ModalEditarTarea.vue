<script lang="ts" setup>
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonSelectOption,
  IonSelect
} from '@ionic/vue';
import type { OverlayEventDetail } from '@ionic/core/components';
import { ref, defineEmits } from 'vue';
import api from '@/services/api'; // Importa tu servicio de API aquí
import { CanalPusher } from '@/services/pusher'; 
const isopen = ref(true);
const emits = defineEmits(['close', 'confirmed']);
const props = defineProps({
 
  IdProyects: {
    type: Number,
    required: false
  },
  idUsuario: {
    type: Number,
    required: false
  },
  IdTarea: {
    type: Number,
    required: false
  },
  titleTask: {
    type: String,
    required: false
  },
  descripcion: {
    type: String,
    required: false
  },
  estado: {
    type: String,
    required: false
  }


});

const proyectoId = props.IdProyects;
const tareaId = props.IdTarea;
const idUsuario = props.idUsuario;
const titleTask = ref(props.titleTask);
const descriptionTask = ref(props.descripcion);
const estadoTask = ref(props.estado);
const usersLoaded = ref(false);
const taskInput = ref<any>();
const descriptionInput = ref<any>();    
const usuariosInput = ref<any>();

const modalEditTask = ref<any>(null);


const cancel = () => {
alert('Modal closed'+ ' ' + tareaId + ' ' + proyectoId + ' ' + idUsuario);
  modalEditTask.value?.$el?.dismiss(null, 'cancel');
 emits('close');
};

const confirm = async () => {
console.log(taskInput.value?.value);


  enviarTareas();
 
modalEditTask.value?.$el?.dismiss(null, 'confirm');
emits('close');
  emits('confirmed');
};

const onWillDismiss = (event: CustomEvent<OverlayEventDetail>) => {
  if (event.detail.role === 'confirm') {
   emits('confirmed');

  }

};
const enviarTareas = async () => {
  const taskInputEl =  titleTask.value;
  const descriptionInputEl = descriptionTask.value;
  const taskStatus = estadoTask.value;
  const proyecto = proyectoId;
  const taskUsers = idUsuario;

  // Validar que todos los campos estén completos
 if (!taskInputEl || !descriptionInputEl ||  !taskUsers) {
    console.error('Todos los campos son obligatorios');
    alert('Por favor, complete todos los campos antes de enviar.');
    return;
  }
    try {
      const response = await api.put('/tareas/' + tareaId, {
        titulo_tarea: taskInputEl,
        descripcion: descriptionInputEl,
        estado: taskStatus,
        id_usuario: taskUsers,
        id_proyecto: proyecto,
      });
      console.log('Tarea creada:', response.data);
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };
  const users = ref<any>();
  const getUsers = async () => {
    try {
      const response = await api.get('/usuarios');
      users.value = response.data;
      usersLoaded.value = true;
      console.log('Usuarios obtenidos:', users.value); // Mostrar el objeto de los usuarios en la consola
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };
    
  getUsers();
  
</script>
<template>
  <ion-modal
   ref="modalEditTask"
   :is-open="isopen"
    @willDismiss="onWillDismiss"
  >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel">Cancel</ion-button>
        </ion-buttons>
        <ion-title>Welcome</ion-title>
        <ion-buttons slot="end">
          <ion-button  @click="confirm">Confirm</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
      <ion-input
        v-model="titleTask"
        label="Task Title"
        label-placement="stacked"
        type="text"
        placeholder="Task title"
      ></ion-input>
      </ion-item>
      <ion-item>
      <ion-input
        v-model="descriptionTask"
        label="Task Description"
        label-placement="stacked"
        type="text"
        placeholder="Task description"
      ></ion-input>
      </ion-item>
        <ion-item  interface="action-sheet">
        <ion-select
        interface="alert"
        v-model="estadoTask"
        
        label="Task Status"
        label-placement="stacked"
        placeholder="Select status"
            >
        <ion-select-option value="pendiente" style="color: white;">
          Pendiente 
        </ion-select-option>
        <ion-select-option value="en progreso" style="color: white;">
          En progreso
        </ion-select-option>
        <ion-select-option value="completada" style="color: white;">
          Completado
        </ion-select-option>
            </ion-select>
      </ion-item>
    
    </ion-content>
  </ion-modal>
</template>




