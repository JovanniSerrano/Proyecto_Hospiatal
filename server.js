const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

const MONGO_URI = "mongodb+srv://alanuser:Hospiatal2026@clusterhospiatal.elcsn56.mongodb.net/?appName=ClusterHospiatal";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// --- MODELOS DE MONGODB ---
const Paciente = mongoose.model('Paciente', new mongoose.Schema({
    _id: String, nombre: String, curp: String, rfc: String, direccion: String, sangre: String, alergias: String
}, { collection: 'pacientes' }));

const Personal = mongoose.model('Personal', new mongoose.Schema({
    _id: String, nombre: String, puesto: String, turno: String, telefono: String
}, { collection: 'personal' }));

const Inventario = mongoose.model('Inventario', new mongoose.Schema({
    _id: String, producto: String, cantidad: Number, caducidad: String
}, { collection: 'inventario' }));

const Factura = mongoose.model('Factura', new mongoose.Schema({
    _id: String, cliente: String, total: Number, fecha: String
}, { collection: 'facturas' }));

// --- CONEXIÓN A BASE DE DATOS ---
mongoose.connect(MONGO_URI)
    .then(() => console.log("🚀 Conexión exitosa a la Base de Datos 'Hospiatal' en MongoDB Atlas"))
    .catch(err => console.error("❌ Error de conexión a MongoDB:", err));

// --- RUTAS DE LA API (CRUD) ---

// PACIENTES
app.get('/api/pacientes', async (req, res) => { res.json(await Paciente.find()); });
app.post('/api/pacientes', async (req, res) => {
    try { await new Paciente(req.body).save(); res.json({ mensaje: '✅ Paciente guardado en MongoDB' }); }
    catch { res.status(500).json({ mensaje: '❌ Error al guardar paciente' }); }
});

// PERSONAL
app.get('/api/personal', async (req, res) => { res.json(await Personal.find()); });
app.post('/api/personal', async (req, res) => {
    try { await new Personal(req.body).save(); res.json({ mensaje: '✅ Personal guardado en MongoDB' }); }
    catch { res.status(500).json({ mensaje: '❌ Error al guardar personal' }); }
});

// INVENTARIO
app.get('/api/inventario', async (req, res) => { res.json(await Inventario.find()); });
app.post('/api/inventario', async (req, res) => {
    try { await new Inventario(req.body).save(); res.json({ mensaje: '✅ Producto guardado en MongoDB' }); }
    catch { res.status(500).json({ mensaje: '❌ Error al guardar en inventario' }); }
});

// FACTURAS
app.get('/api/facturas', async (req, res) => { res.json(await Factura.find()); });
app.post('/api/facturas', async (req, res) => {
    try { await new Factura(req.body).save(); res.json({ mensaje: '✅ Factura guardada en MongoDB' }); }
    catch { res.status(500).json({ mensaje: '❌ Error al guardar factura' }); }
});

// Ruta principal para servir el HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`💻 Servidor web corriendo en http://localhost:${PORT}`);
});