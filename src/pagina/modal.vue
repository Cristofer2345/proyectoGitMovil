<!-- src/components/InlineModal.vue -->
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
} from '@ionic/vue';
import type { OverlayEventDetail } from '@ionic/core/components';
import { ref, defineEmits } from 'vue';
import api from '@/services/api'; // Importa tu servicio de API aquí

const emits = defineEmits<{
  (e: 'confirmed', name: string): void;
}>();
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
  enviarTareas();
  const inputEl = await input.value.$el?.getInputElement();
  const name = inputEl?.value;


  (modal.value?.$el as HTMLIonModalElement)?.dismiss(name, 'confirm');
};

const onWillDismiss = (event: CustomEvent<OverlayEventDetail>) => {
  if (event.detail.role === 'confirm') {
    emits('confirmed', event.detail.data);
  }

};
const enviarTareas = async () => {
  const taskInputEl = await taskInput.value.$el?.getInputElement();
  const descriptionInputEl = await descriptionInput.value.$el?.getInputElement();
  const taskTitle = taskInputEl?.value;
  const taskDescription = descriptionInputEl?.value;
  const taskStatus = statusInput.value?.value;
  const proyecto = 1;
  const taskUsers = 1;


    try {
      const response = await api.post('/tareas', {
        titulo_tarea: taskTitle,
        descripcion: taskDescription,
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
  alert();
</script>
<template>
  <ion-modal
    ref="modal"
    trigger="open-modal"
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
        ref="input"
        label="Enter your name"
        label-placement="stacked"
        type="text"
        placeholder="Your name"
      ></ion-input>
      </ion-item>
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
      <ion-item>
      <ion-select
        ref="statusInput"
        label="Task Status"
        label-placement="stacked"
        placeholder="Select status"
      >
        <ion-select-option value="pendiente">Pending</ion-select-option>
        <ion-select-option value="en progreso">In Progress</ion-select-option>
        <ion-select-option value="completada">Completed</ion-select-option>
      </ion-select>
      </ion-item>
      <ion-item v-if="usersLoaded">
        <ion-select
        ref="usuariosInput"
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


