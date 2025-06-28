import express from 'express';
import cors from 'cors';
const app = express();

const HOST = "0.0.0.0"
const PORT = process.env.REACT_APP_BACKEND_PORT;

const allowedOrigins = [
    `http://localhost:${process.env.FRONT_END_PORT}`,                  // local dev
    `http://${process.env.LAN_HOST}:${process.env.FRONT_END_PORT}`,   // LAN live frontend
];

console.log(`Allowed Origins\n|____ ${allowedOrigins}\n`);

app.use(cors({
    origin: allowedOrigins,  // React app origin
    credentials: true                // allow cookies
}));

// Custom Error Handler to hide verbose errors from clients
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
});

// attempting to cover up digital foot-print
app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.send("You've Reached the Back-End!\n");
});

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});