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
        </IonContent>
     
    </IonPage>
</template>


  
<script lang="ts" setup>
 import { ref, onMounted,onUnmounted,nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/services/api';
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
  } from '@ionic/vue';
  
  const titulo = ref('');
  const id = ref('');
  const router = useRouter();
  
  const crearProyecto = async () => {
  try {
    const response = await api.post('/proyectos', {
      id: id.value,
      titulo: titulo.value,
    });
    alert('Proyecto creado con éxito');
    router.push('/home');
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Error al crear proyecto:', JSON.stringify(error.response.data, null, 2));
      alert(error.response.data.message || 'Error al crear el proyecto');
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
  // Función para cerrar el menú
const closeMenu = () => {
  const menu = document.querySelector('ion-menu');
  if (menu) {
    menu.close(); // Cierra el menú cuando cambia de página
  }
};
onMounted(() => {
 
  // Aseguramos que el menú se cierre después de cada cambio de ruta
  nextTick(() => {
    window.addEventListener('ionRouteDidChange', closeMenu);
  });

  // Limpiar el evento cuando se desmonta el componente
  onUnmounted(() => {
    window.removeEventListener('ionRouteDidChange', closeMenu);
  });
});
</script>
  
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
</style>
  