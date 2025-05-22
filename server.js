const express = require('express');
const cors = require('cors');
const app = express();
const FRONTEND_URL = 'https://inventario-phi.vercel.app';

app.use(cors({
  origin: FRONTEND_URL
}));
app.use(express.json());


let usuarios = []; // Simulación de base de datos

// Registro de usuario
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

// Login de usuario
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const user = usuarios.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.json({ message: 'Login exitoso', user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


const nodemailer = require('nodemailer');

app.post('/api/enviar-correo', async (req, res) => {
    const { nombre, telefono, notas, empleado } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lamanwebstudio@gmail.com',
            pass: 'fsdq nyhm vpnd wpiv'
        }
    });

    const mailOptions = {
        from: 'Sistema de Inventario',
        to: 'lamanwebstudio@gmail.com',
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
        console.error(err);
        res.status(500).json({ message: 'Error al enviar el correo' });
    }
});
