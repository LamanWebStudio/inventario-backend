const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
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
