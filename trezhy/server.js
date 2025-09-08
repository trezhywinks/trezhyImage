const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');

const logs = []; 
app.use(cors());
app.use(express.json());
app.set('trust proxy', true);
app.post('/monitor', (req, res) => {
    const logData = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        url: req.body.url,
        userAgent: req.body.userAgent,
        referrer: req.body.referrer
    };

    logs.push(logData);
    console.log(`[${logData.timestamp}] New Acess ${logData.ip} -> ${logData.url}`);

    fs.appendFileSync('acessos.log', JSON.stringify(logData) + '\n');

    res.status(200).send('Log received');
});

app.get('/monitor', (req, res) => {
    res.json(logs);
});

const PORT = 9595;
app.listen(PORT, () => console.log(`🚀 server running in http://localhost:${PORT}/monitor`));
