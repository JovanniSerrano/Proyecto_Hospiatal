const mongoose = require('mongoose');
const fs = require('fs');

// Conexión directa a tu MongoDB Atlas
const MONGO_URI = "mongodb+srv://alanuser:Hospiatal2026@clusterhospiatal.elcsn56.mongodb.net/Hospiatal?retryWrites=true&w=majority&appName=ClusterHospiatal";

async function iniciarMigracion() {
    try {
        console.log("⏳ Conectando a MongoDB Atlas...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ ¡Conectado con éxito a MongoDB Atlas!");

        // Mapeo exacto de Colección en Atlas -> Archivo JSON -> Nombre Modelo
        const tareas = [
            { coleccion: 'pacientes', archivo: './pacientes.json', modelo: 'pacientes' },
            { coleccion: 'doctores', archivo: './doctores.json', modelo: 'doctores' }, 
            { coleccion: 'inventarios', archivo: './inventario.json', modelo: 'inventarios' }, 
            { coleccion: 'facturas', archivo: './facturas.json', modelo: 'facturas' }
        ];

        for (const tarea of tareas) {
            // Verificar si el archivo JSON existe en la carpeta
            if (!fs.existsSync(tarea.archivo)) {
                console.log(`⚠️ Archivo omitido: '${tarea.archivo}' no existe en este directorio.`);
                continue;
            }

            // Leer y validar contenido
            const contenido = fs.readFileSync(tarea.archivo, 'utf-8').trim();
            if (!contenido) {
                console.log(`⚠️ Archivo vacío omitido: '${tarea.archivo}'`);
                continue;
            }

            const datos = JSON.parse(contenido);
            const Modelo = mongoose.model(tarea.modelo, new mongoose.Schema({}, { strict: false }), tarea.coleccion);

            // Subir los registros evitando duplicidades de ID
            for (const item of datos) {
                if (item._id) {
                    await Modelo.findByIdAndUpdate(item._id, item, { upsert: true });
                }
            }
            console.log(`📦 Colección '${tarea.coleccion}' sincronizada con éxito (${datos.length} registros).`);
        }

        console.log("🎉 ¡Proceso de migración a la nube terminado!");
    } catch (error) {
        console.error("❌ Error durante la migración:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Conexión con Atlas cerrada de forma segura.");
    }
}

iniciarMigracion();