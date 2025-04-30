import Echo, { Channel } from 'laravel-echo';
import Pusher from 'pusher-js';

// Extender la interfaz Window para incluir la propiedad Pusher
declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

// Inicializar Pusher y Laravel Echo
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_KEY || 'a4d8798ab17f089f3ec8', 
    cluster: 'us2',
    forceTLS: true,
});


interface TareaActualizadaTimeReal {
    tarea: {
        id: number;
        nombre: string;
        descripcion: string;
        estado: string;
        titulo_tarea: string;
    }
 
    accion: 'añadido' | 'actualizado' | 'eliminado';
}

// Función para suscribirse a un canal de Pusher y escuchar eventos
export function CanalPusher(projectId: any, callback: (data:TareaActualizadaTimeReal) => void) {
    console.log(`🧲 Subscrito al canal proyecto.${projectId}`);

    const channel: Channel = echo.channel('proyecto.' + projectId);

    channel.listen('.tarea.actualizada', (event:TareaActualizadaTimeReal) => {
        if (event && event.tarea && event.accion) {
            console.log('📢 Evento tarea.actualizada recibido:', event.tarea);
            callback(event);  
        } else {
            console.error('⚠️ Datos inválidos recibidos en el evento tarea.actualizada:', event);
        }
    });


    return () => {
        echo.leave('proyecto.' + projectId);
        console.log(`🚪 Saliste del canal proyecto.${projectId}`);
    };
}
