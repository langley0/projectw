const express = require('express')

const app = express();
app.get('/', (req, res)  => {
    res.json({ text:"구웃"});
});

app.get('/api', (req, res)  => {
    res.json({ text:"api"});
});

app.listen(8081, () => {
    console.log('Server listens port 8081');
})