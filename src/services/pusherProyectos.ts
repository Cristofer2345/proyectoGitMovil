import Echo, { Channel } from 'laravel-echo';
import Pusher from 'pusher-js';

// Extender la interfaz Window para incluir la propiedad Pusher
declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_KEY || 'a4d8798ab17f089f3ec8',
    cluster: 'us2',
    forceTLS: true,
});

// Interfaz del evento de proyecto
interface ProyectoEventoTimeReal {
    proyecto: {
      id: number;
      titulo: string;
      created_by: number;
      updated_at: string;
      created_at: string;
    };
    accion: 'añadido' | 'actualizado' | 'eliminado';
  }
  

// Función para suscribirse al canal de proyectos
export function CanalPusherProyecto(callback: (data: ProyectoEventoTimeReal) => void) {
    console.log(`🧲 Subscrito al canal proyecto.evento`);

    const channel: Channel = echo.channel('proyectos');

    channel.listen('.proyecto.evento', (event: ProyectoEventoTimeReal) => {
        if (event && event.proyecto && event.accion) {
            console.log('📢 Evento proyecto.evento recibido:', event.accion);
            callback(event);
        } else {
            console.error('⚠️ Datos inválidos recibidos en el evento proyecto.evento:', event);
        }
    });

    return () => {
        echo.leave('proyectos');
        console.log(`🚪 Saliste del canal proyecto.global`);
    };
}
