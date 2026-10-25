const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Permite la lectura de JSON y habilita peticiones desde tu página web (CORS)
app.use(cors());
app.use(express.json());

// Objeto en memoria para guardar el estado del sistema en tiempo real
let sistemaData = {
    distancia: 0,       // Guardará los cm del sensor
    comando: 'detener', // Guardará 'izquierda', 'derecha' o 'detener'
    modo: 'auto'        // Guardará 'auto' o 'manual'
};

// ==========================================
// ENDPOINTS PARA EL SENSOR ULTRASÓNICO
// ==========================================

// 1. El Arduino envía aquí la distancia medida (POST)
app.post('/sensor', (req, res) => {
    const { distancia } = req.body;
    if (distancia !== undefined) {
        sistemaData.distancia = distancia;
        res.json({ status: 'ok', mensaje: 'Distancia actualizada', distancia: sistemaData.distancia });
    } else {
        res.status(400).json({ status: 'error', mensaje: 'Falta el campo distancia' });
    }
});

// 2. La página web consulta aquí la distancia actual (GET)
app.get('/sensor', (req, res) => {
    res.json({ distancia: sistemaData.distancia });
});

// ==========================================
// ENDPOINTS PARA EL CONTROL DEL MOTOR Y MODO
// ==========================================

// 3. La página web envía el comando manual al motor (POST)
app.post('/motor', (req, res) => {
    const { comando } = req.body;
    if (comando) {
        sistemaData.comando = comando;
        res.json({ status: 'ok', comandoActual: sistemaData.comando });
    } else {
        res.status(400).json({ status: 'error', mensaje: 'Falta el comando' });
    }
});

// 4. El Arduino lee aquí qué comando debe ejecutar (GET)
app.get('/motor', (req, res) => {
    res.json({ 
        comando: sistemaData.comando,
        modo: sistemaData.modo 
    });
});

// 5. La página web cambia entre modo 'auto' y 'manual' (POST)
app.post('/modo', (req, res) => {
    const { modo } = req.body;
    if (modo === 'auto' || modo === 'manual') {
        sistemaData.modo = modo;
        res.json({ status: 'ok', modoActual: sistemaData.modo });
    } else {
        res.status(400).json({ status: 'error', mensaje: 'Modo no válido' });
    }
});

// Iniciar servidor local
app.listen(PORT, () => {
    console.log(`🚀 API REST ejecutándose en: http://localhost:${PORT}`);
});