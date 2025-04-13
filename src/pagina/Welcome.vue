<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Bienvenido</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="welcome-content" fullscreen>
      <div class="welcome-container">
        <ion-icon :icon="logoIcon" class="welcome-icon"></ion-icon>
        <h1 class="welcome-title">Trello-like App</h1>
        <p class="welcome-subtitle">Organiza tus proyectos de forma eficiente</p>
        <ion-button expand="block" router-link="/login" class="login-button">
          <ion-icon slot="start" :icon="logInIcon" />
          Iniciar sesión
        </ion-button>
        <ion-button expand="block" router-link="/register" class="register-button">
          <ion-icon slot="start" :icon="personAddIcon" />
          Registrarse
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">   
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/vue';
import { logInOutline, personAddOutline, gridOutline } from 'ionicons/icons';
import './welcome.css';
const logInIcon = logInOutline;
const personAddIcon = personAddOutline;
const logoIcon = gridOutline;
</script>


