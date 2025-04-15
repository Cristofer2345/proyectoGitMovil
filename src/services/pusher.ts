import Pusher from 'pusher-js';
import { a } from 'vite/dist/node/types.d-aGj9QkWt';

// Inicializar Pusher
const pusher = new Pusher(import.meta.env.PUSHER_KEY || 'a4d8798ab17f089f3ec8', {
    cluster: 'us2',
    forceTLS: true
});


export function CanalPusher(projectId:number, callback:any) {
    const channel = pusher.subscribe('proyecto.' + projectId);

    channel.bind('tarea.actualizada', (data:any) => {
        if (data) {
            callback(data); // Llama a la función de callback con los datos recibidos
        } else {
            console.error('Datos inválidos recibidos en el evento tarea.actualizada');
        }
    });

    channel.bind('pusher:subscription_error', (status:any) => {
        console.error('Error al suscribirse al canal:', status);
    });

    return () => {
        pusher.unsubscribe('proyecto.' + projectId); // Desuscribirse cuando ya no sea necesario
    };
}
