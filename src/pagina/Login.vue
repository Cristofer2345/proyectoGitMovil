<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title >Login</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding  principal">
        <ion-input v-model="email" placeholder="Correo" type="email" />
        <ion-input v-model="password" placeholder="Contraseña" type="password" />
        <ion-button  @click="login" class="ion-button-log" >Ingresar</ion-button>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/services/api';
  import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton,
  } from '@ionic/vue';
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const login = async () => {
    try {
      const response = await api.post('/login', {
        email: email.value,
        password: password.value,
      });
     
      localStorage.setItem('token', response.data.token);
      router.push('/home');
    } catch (error) {
  if (error.response && error.response.data) {
    console.error('Login error:', JSON.stringify(error.response.data, null, 2));
    alert(error.response.data.message || 'Error al iniciar sesión');
  } else {
    console.error('Login error:', error.message);
    alert('Error inesperado al iniciar sesión');
  }
}
  };
  </script>

  <style>
  
  .ion-button-log {
  --background: #A7F3D0;
   border-radius: 300px;
  }
  
   ion-header {
  --background: #A7F3D0;
  
  }
  
  </style>
