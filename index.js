const express = require('express');
const app = express();
const path = require('path');

// Configurar directorio estático
app.use(express.static(path.join(__dirname, 'src')));

// Ruta de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(3005, () => {
    console.log('Server is running on port 3005');
});