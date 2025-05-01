<template>
    <ion-modal :is-open="mostrar" @didDismiss="cerrarModal">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Editar tarea</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="cerrarModal">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item>
          <ion-label position="stacked">Título</ion-label>
          <ion-input v-model="titulo" />
        </ion-item>
  
        <ion-item>
          <ion-label position="stacked">Estado</ion-label>
          <ion-select v-model="estado">
            <ion-select-option value="pendiente">Por hacer</ion-select-option>
            <ion-select-option value="en progreso">En progreso</ion-select-option>
            <ion-select-option value="completada">Completado</ion-select-option>
          </ion-select>
        </ion-item>
  
        <ion-button expand="full" @click="guardarCambios">Guardar</ion-button>
      </ion-content>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption
  } from '@ionic/vue';
  
  import { ref, watch } from 'vue';
  import api from '@/services/api';
  
  const props = defineProps<{
    mostrar: boolean;
    tarea: any;
  }>();
  
  const emit = defineEmits(['cerrar', 'guardado']);
  
  const titulo = ref('');
  const estado = ref('');
  
  watch(() => props.tarea, (nuevaTarea) => {
    if (nuevaTarea) {
      titulo.value = nuevaTarea.titulo_tarea;
      estado.value = nuevaTarea.estado;
    }
  }, { immediate: true });
  
  const cerrarModal = () => {
    emit('cerrar');
  };
  
  const guardarCambios = async () => {
    try {
      await api.put(`/tareas/${props.tarea.id}`, {
        titulo_tarea: titulo.value,
        estado: estado.value
      });
      emit('guardado');
      cerrarModal();
    } catch (error) {
      console.error('Error al editar tarea:', error);
    }
  };
  </script>