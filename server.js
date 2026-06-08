const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Habilitamos la librería de seguridad

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 🔥 MIDDLEWARES (CONFIGURACIÓN DE PERMISOS)
// ==========================================
app.use(cors()); // <-- ESTA LÍNEA ES LA QUE QUITA EL ERROR ROJO
app.use(express.json());

// ==========================================
// 🔌 CONEXIÓN A MONGO DB ATLAS
// ==========================================
// Reemplaza esta URL por tu cadena de conexión real si es diferente
const MONGO_URI = "mongodb+srv://alan:alan123@cluster0.v8v6z.mongodb.net/Hospiatal?retryWrites=true&w=share";

mongoose.connect(MONGO_URI)
    .then(() => console.log('🍃 Conectado exitosamente a MongoDB Atlas (Base: Hospiatal)'))
    .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// ==========================================
// 📊 DEFINICIÓN DE ESQUEMAS Y MODELOS
// ==========================================

// Esquema de Doctores (Personal Médico)
const doctorSchema = new mongoose.Schema({
    _id: String,
    nombre: String,
    rol: String,
    especialidad: String,
    cedula: String,
    direccion: String
}, { versionKey: false });

const Doctor = mongoose.model('Doctor', doctorSchema, 'doctores');

// Esquema de Pacientes
const pacienteSchema = new mongoose.Schema({
    _id: String,
    nombre: String,
    curp: String,
    rfc: String,
    direccion: String,
    sangre: String,
    alergias: String
}, { versionKey: false });

const Paciente = mongoose.model('Paciente', pacienteSchema, 'pacientes');

// Esquema de Inventario
const inventarioSchema = new mongoose.Schema({
    _id: String,
    articulo: String,
    categoria: String,
    stock: String,
    caducidad: String,
    precio: String
}, { versionKey: false });

const Inventario = mongoose.model('Inventario', inventarioSchema, 'inventarios');

// Esquema de Facturas
const facturaSchema = new mongoose.Schema({
    _id: String,
    paciente_id: String,
    rfc: String,
    concepto: String,
    total: String,
    estado: String
}, { versionKey: false });

const Factura = mongoose.model('Factura', facturaSchema, 'facturas');


// ==========================================
// 🛣️ RUTAS DE LA API (CRUD COMPLETO)
// ==========================================

// --- CONTROLADOR GENÉRICO PARA AGILIZAR RUTAS ---
const mapearModelos = {
    doctores: Doctor,
    pacientes: Paciente,
    inventario: Inventario,
    facturas: Factura
};

// Ruta Base de prueba
app.get('/api', (req, res) => {
    res.json({ mensaje: "🚀 Servidor backend activo en la nube de Render corriendo API Hospiatal" });
});

// GET: Obtener todos los registros de una colección
app.get('/api/:coleccion', async (req, res) => {
    const Modelo = mapearModelos[req.params.coleccion];
    if (!Modelo) return res.status(404).json({ error: "Colección no encontrada" });

    try {
        const datos = await Modelo.find();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Insertar o actualizar un documento
app.post('/api/:coleccion', async (req, res) => {
    const Modelo = mapearModelos[req.params.coleccion];
    if (!Modelo) return res.status(404).json({ error: "Colección no encontrada" });

    try {
        const { _id } = req.body;
        // Si ya existe el ID, lo actualiza (Upsert)
        const documento = await Modelo.findByIdAndUpdate(_id, req.body, { new: true, upsert: true });
        res.json({ mensaje: "Sincronizado correctamente con MongoDB Atlas", documento });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Eliminar un documento por ID
app.delete('/api/:coleccion/:id', async (req, res) => {
    const Modelo = mapearModelos[req.params.coleccion];
    if (!Modelo) return res.status(404).json({ error: "Colección no encontrada" });

    try {
        await Modelo.findByIdAndDelete(req.params.id);
        res.json({ mensaje: `Documento ${req.params.id} eliminado correctamente.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 🚀 ARRANQUE DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend activo en el puerto ${PORT}`);
});