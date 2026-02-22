const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Serve la dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard', 'index.html'));
});

// API per generare audio
app.post('/api/generate-audio', (req, res) => {
    const { category, subcategory, language, text } = req.body;
    
    console.log('📝 Richiesta ricevuta:', {
        category,
        subcategory, 
        language,
        text
    });

    setTimeout(() => {
        res.json({
            success: true,
            message: 'Audio generato!',
            audioUrl: '/audio/generated-' + Date.now() + '.mp3'
        });
    }, 2000);
});

// Avvia su porta diversa per non disturbare
const PORT = 3001; // Porta diversa!
app.listen(PORT, () => {
    console.log(`🎨 Dashboard su http://localhost:${PORT}`);
});
