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

const emits = defineEmits<{
  (e: 'confirmed', name: string): void;
}>();

const props = defineProps({
  miVariable: {
    type: Number,
    required: false
  },
  tareaId: {
    type: Number,
    required: true // ID de la tarea a actualizar
  }
});

const proyectoId = props.miVariable;
const tareaId = props.tareaId;

const usersLoaded = ref(false);
const taskInput = ref<any>();
const descriptionInput = ref<any>();
const statusInput = ref<any>();
const usuariosInput = ref<any>();
const modal = ref<any>(null);
const input = ref<any>(null);

const cancel = () => {
  modal.value.$el?.dismiss(null, 'cancel');
};

const confirm = async () => {
  console.log(statusInput.value?.value);
  actualizarTarea();

  (modal.value?.$el as HTMLIonModalElement)?.dismiss('confirm');
};

const onWillDismiss = (event: CustomEvent<OverlayEventDetail>) => {
  if (event.detail.role === 'confirm') {
    emits('confirmed', event.detail.data);
  }
};

const actualizarTarea = async () => {
  const taskInputEl = await taskInput.value.$el?.getInputElement();
  const descriptionInputEl = await descriptionInput.value.$el?.getInputElement();
  const taskTitle = taskInputEl?.value;
  const taskDescription = descriptionInputEl?.value;
  const taskStatus = statusInput.value;
  const proyecto = proyectoId;
  const taskUsers = usuariosInput.value;

  // Validar que todos los campos estén completos
  if (!taskTitle || !taskDescription || !taskStatus || !taskUsers) {
    console.error('Todos los campos son obligatorios');
    alert('Por favor, complete todos los campos antes de enviar.');
    return;
  }

  try {
    const response = await api.put(`/tareas/${tareaId}`, {
      titulo_tarea: taskTitle,
      descripcion: taskDescription,
      estado: taskStatus,
      id_usuario: taskUsers,
      id_proyecto: proyecto,
    });
    console.log('Tarea actualizada:', response.data);
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
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
  ref="modalActualizar"
  @willDismiss="onWillDismiss"
>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel">Cancel</ion-button>
        </ion-buttons>
        <ion-title>Actualizar Tarea</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="confirm">Confirm</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-input
          ref="taskInput"
          label="Task Title"
          label-placement="stacked"
          type="text"
          placeholder="Task title"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-input
          ref="descriptionInput"
          label="Task Description"
          label-placement="stacked"
          type="text"
          placeholder="Task description"
        ></ion-input>
      </ion-item>
      <ion-item interface="action-sheet">
        <ion-select
          interface="alert"
          v-model="statusInput"
          label="Task Status"
          label-placement="stacked"
          placeholder="Select status"
        >
          <ion-select-option value="pendiente">Pendiente</ion-select-option>
          <ion-select-option value="en progreso">En progreso</ion-select-option>
          <ion-select-option value="completada">Completada</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-if="usersLoaded" interface="action-sheet">
        <ion-select
          interface="alert"
          v-model="usuariosInput"
          label="Task Users"
          label-placement="stacked"
          placeholder="Select user"
        >
          <ion-select-option 
            v-for="user in users" 
            :key="user.id" 
            :value="user.id"
            style="color: white;"
          >
            {{ user.name }}
          </ion-select-option>
        </ion-select>
      </ion-item>
    </ion-content>
  </ion-modal>
</template>


