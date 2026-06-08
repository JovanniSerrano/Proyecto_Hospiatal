const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares esenciales
app.use(cors());
app.use(express.json());

// 🔌 CONEXIÓN DIRECTA A TU MONGODB ATLAS ☁️
const MONGO_URI = "mongodb+srv://alanuser:Hospiatal2026@clusterhospiatal.elcsn56.mongodb.net/Hospiatal?retryWrites=true&w=majority&appName=ClusterHospiatal";

mongoose.connect(MONGO_URI)
    .then(() => console.log('🔌 Conectado con éxito a MongoDB Atlas (Base de datos: Hospiatal)'))
    .catch(err => console.error('❌ Error crítico de conexión a Atlas:', err));

// --- DECLARACIÓN DE MODELOS EXACTOS DE TU ATLAS ---
const Paciente = mongoose.model('pacientes', new mongoose.Schema({ _id: String }, { strict: false }), 'pacientes');
const Doctor = mongoose.model('doctores', new mongoose.Schema({ _id: String }, { strict: false }), 'doctores'); 
const Inventario = mongoose.model('inventarios', new mongoose.Schema({ _id: String }, { strict: false }), 'inventarios'); 
const Factura = mongoose.model('facturas', new mongoose.Schema({ _id: String }, { strict: false }), 'facturas');

// Función auxiliar para conectar las peticiones de tu Frontend con los Modelos
const obtenerModelo = (tipo) => {
    // Si tu HTML pide /api/pacientes, /api/doctores, /api/inventarios o /api/facturas
    if (tipo === 'pacientes') return Paciente;
    if (tipo === 'doctores' || tipo === 'personal') return Doctor; 
    if (tipo === 'inventarios' || tipo === 'inventario') return Inventario; 
    if (tipo === 'facturas') return Factura;
    return null;
};

// --- RUTAS DE LA API (CRUD) ---

// 1. OBTENER DATOS (GET)
app.get('/api/:coleccion', async (req, res) => {
    try {
        const Modelo = obtenerModelo(req.params.coleccion);
        if (!Modelo) return res.status(400).json({ error: 'Colección no válida en la API' });
        
        const registros = await Modelo.find({});
        res.json(registros);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar MongoDB Atlas' });
    }
});

// 2. INSERTAR O ACTUALIZAR (POST)
app.post('/api/:coleccion', async (req, res) => {
    try {
        const Modelo = obtenerModelo(req.params.coleccion);
        if (!Modelo) return res.status(400).json({ error: 'Colección no válida' });

        const data = req.body;
        await Modelo.findByIdAndUpdate(data._id, data, { upsert: true, new: true });
        res.json({ mensaje: 'Documento sincronizado correctamente en la nube.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar en la nube' });
    }
});

// 3. ELIMINAR (DELETE)
app.delete('/api/:coleccion/:id', async (req, res) => {
    try {
        const Modelo = obtenerModelo(req.params.coleccion);
        if (!Modelo) return res.status(400).json({ error: 'Colección no válida' });

        await Modelo.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Documento eliminado correctamente de Atlas.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el documento' });
    }
});

// Iniciar el backend
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});