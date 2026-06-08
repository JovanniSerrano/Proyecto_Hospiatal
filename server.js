const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware esenciales
app.use(cors());
app.use(express.json());

// 🔌 TU CADENA DE CONEXIÓN REAL A MONGODB ATLAS ☁️
const MONGO_URI = "mongodb+srv://alanuser:Hospiatal2026@clusterhospiatal.elcsn56.mongodb.net/Hospiatal?retryWrites=true&w=majority&appName=ClusterHospiatal";

mongoose.connect(MONGO_URI)
    .then(() => console.log('🔌 Conectado con éxito a MongoDB Atlas desde el Servidor API'))
    .catch(err => console.error('❌ Error crítico de conexión a Atlas:', err));

// --- DECLARACIÓN DE MODELOS DINÁMICOS CORREGIDOS ---
const Paciente = mongoose.model('pacientes', new mongoose.Schema({ _id: String }, { strict: false }), 'pacientes');
const Doctor = mongoose.model('doctores', new mongoose.Schema({ _id: String }, { strict: false }), 'doctores'); 
const Inventario = mongoose.model('inventarios', new mongoose.Schema({ _id: String }, { strict: false }), 'inventarios'); 
const Factura = mongoose.model('facturas', new mongoose.Schema({ _id: String }, { strict: false }), 'facturas');

// Función auxiliar para mapear el parámetro de la URL al modelo de Mongoose
const obtenerModelo = (tipo) => {
    if (tipo === 'pacientes') return Paciente;
    if (tipo === 'doctores') return Doctor;
    if (tipo === 'inventario') return Inventario; // Mantiene el formato de tu fetch de la URL
    if (tipo === 'facturas') return Factura;
    return null;
};

// --- RUTAS DE LA API (CRUD COMPLETO) ---

// 1. OBTENER TODOS LOS DOCUMENTOS DE UNA COLECCIÓN (GET)
app.get('/api/:coleccion', async (req, res) => {
    try {
        const Modelo = obtenerModelo(req.params.coleccion);
        if (!Modelo) return res.status(400).json({ error: 'Colección no válida' });
        
        const registros = await Modelo.find({});
        res.json(registros);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar Atlas' });
    }
});

// 2. GUARDAR O ACTUALIZAR UN DOCUMENTO (POST)
app.post('/api/:coleccion', async (req, res) => {
    try {
        const Modelo = obtenerModelo(req.params.coleccion);
        if (!Modelo) return res.status(400).json({ error: 'Colección no válida' });

        const data = req.body;
        // Upsert: Si existe lo actualiza, si no existe lo inserta.
        await Modelo.findByIdAndUpdate(data._id, data, { upsert: true, new: true });
        res.json({ mensaje: 'Documento sincronizado con éxito en MongoDB Atlas.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el documento' });
    }
});

// 3. ELIMINAR UN DOCUMENTO POR ID (DELETE)
app.delete('/api/:coleccion/:id', async (req, res) => {
    try {
        const Modelo = obtenerModelo(req.params.coleccion);
        if (!Modelo) return res.status(400).json({ error: 'Colección no válida' });

        await Modelo.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Documento eliminado correctamente de la nube.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el documento' });
    }
});

// Inicializar el servidor local en el puerto 3000
app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend corriendo en: http://localhost:${PORT}`);
});