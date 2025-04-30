<style scoped>
/* Fondo con degradado menos intenso */
ion-content {
    --background: linear-gradient(135deg, #5c9bf4, #3052a0, #8ea6ff);
    animation: backgroundShift 6s infinite alternate;
}

/* Contenedor de elementos de carga */
.loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    animation: fadeIn 1.5s ease-in-out;
}

/* Estilo del spinner */
.spinner {
    --spinner-color: #ffffff;
    margin-bottom: 20px;
    animation: pulse 1.5s infinite;
}

/* Estilo del texto de carga */
.loading-text {
    font-size: 1.4rem;
    color: #ffffff;
    font-weight: bold;
    text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
    letter-spacing: 1px;
    animation: textGlow 2s infinite alternate;
}

/* Animación de entrada */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Animación de fondo */
@keyframes backgroundShift {
    from {
        --background: linear-gradient(135deg, #a3c9ff, #99b8ff, #8ea6ff);
    }
    to {
        --background: linear-gradient(135deg, #8ea6ff, #99b8ff, #a3c9ff);
    }
}

/* Animación de pulso para el spinner */
@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
}

/* Animación de brillo para el texto */
@keyframes textGlow {
    from {
        text-shadow: 0 3px 6px rgba(255, 255, 255, 0.5);
    }
    to {
        text-shadow: 0 3px 12px rgba(255, 255, 255, 0.8);
    }
}
</style>
