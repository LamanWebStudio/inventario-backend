require('dotenv').config(); // Carga las variables de entorno desde el .env
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const FRONTEND_URLS =['https://inventario-phi.vercel.app', "https://landig-page-gamma.vercel.app"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || FRONTEND_URLS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No autorizado por CORS'));
    }
  }
}));
app.use(express.json());

let usuarios = []; // Simulación de base de datos

// ==============================
// RUTA: Registro de usuario
// ==============================
app.post('/api/registro', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Faltan campos' });
  }

  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    return res.status(409).json({ message: 'El usuario ya existe' });
  }

  usuarios.push({ name, email, password });
  res.json({ message: 'Usuario registrado exitosamente' });
});

// ==============================
// RUTA: Login de usuario
// ==============================
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = usuarios.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  res.json({ message: 'Login exitoso', user });
});

// ==============================
// CONFIG: Nodemailer seguro
// ==============================
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log("✅ Transporter configurado correctamente");
} catch (error) {
  console.error("❌ Error al configurar nodemailer:", error);
}

// ==============================
// RUTA: Enviar correo
// ==============================
app.post('/api/enviar-correo', async (req, res) => {
  const { nombre, telefono, notas, empleado } = req.body;
  console.log("📨 Llegó solicitud al backend:", req.body);
  if (!transporter) {
    return res.status(500).json({ message: 'Error interno: transportador de correo no configurado' });
  }

  const mailOptions = {
    from: `"Sistema de Inventario" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Se manda a uno mismo, o cambia esto si quieres a otro correo
    subject: `📩 Nuevo cliente registrado por ${empleado}`,
    text: `
Nombre del cliente: ${nombre}
Teléfono: ${telefono}
Notas: ${notas}
Registrado por: ${empleado}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Correo enviado correctamente' });
  } catch (err) {
    console.error("❌ Error al enviar el correo:", err);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
});

// ==============================
// PUERTO DEL SERVIDOR
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
