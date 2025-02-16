const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 3000;

// Serve static files from the ASL_Translate directory
app.use(express.static(path.join(__dirname)));

// Proxy API requests to the backend server
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding to the backend
    },
}));

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
    res.redirect('/home');
});

// Serve the index.html file for the /home URL
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the tutorial.html file for each word
app.get('/:word', (req, res) => {
    res.sendFile(path.join(__dirname, 'tutorial.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});