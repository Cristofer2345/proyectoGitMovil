<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Registro</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-input v-model="name" placeholder="Nombre" />
        <ion-input v-model="email" type="email" placeholder="Correo electrónico" />
        <ion-input v-model="password" type="password" placeholder="Contraseña" />
        <ion-button  @click="registrarUsuario" class="ion-button-log">Registrarse</ion-button>
        <ion-button fill="clear" router-link="/login">¿Ya tienes cuenta?</ion-button>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/services/api';
  import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonInput, IonButton,
  } from '@ionic/vue';
  
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const registrarUsuario = async () => {
    const subscriptionId = await new Promise((resolve) => {
      setTimeout(() => {
      resolve(localStorage.getItem('SubscriptionId'));
      }, 10000);
    });

    if (!subscriptionId) {
      alert('No se encontró una suscripción activa.');
      return;
    }
    try {
      const response = await api.post('/register', {
        name: name.value,
        email: email.value,
        credencial: localStorage.getItem('SubscriptionId'),
        password: password.value,
      });
  
      localStorage.setItem('token', response.data.token);
      router.push('/home');
    } catch (error) {
  
      alert('Error al registrarse:', error.response ? error.response.data : error.message);
    }
  };
  </script>
    <style scoped>
  
  .ion-button-log {
 --ion-background-color:#22C55E;
   border-radius: 300px;

  }
  
  </style>
