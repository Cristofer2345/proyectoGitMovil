<template>
    <div class="loading-screen">
        <div class="spinner"></div>
        <p>Cargando...</p>
    </div>
</template>

<script>
export default {
    name: "LoadingScreen",
};
</script>

<style scoped>
.loading-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #ccc;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

p {
    margin-top: 20px;
    font-size: 18px;
    color: #555;
}
</style>