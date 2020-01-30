const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()


const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db  .run(`CREATE TABLE account (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);`)
        .run(`CREATE TABLE coin (id INTEGER, symbol TEXT, amount TEXT, address TEXT);`)
    //;
});

const app = express();
app.use(bodyParser.json())

app.post('/api/login', (req, res)  => {
    const name = req.body.name;
    db.get(`SELECT id FROM account WHERE name = ?`, [name], function (err, row)  {
        if (err) {
            res.status(500).end();
        } else {
            if (row) {
                res.json({ success: true,  id: row.id });
            } else {
                db.run(`INSERT INTO account (name) VALUES (?)`, name, function (err) {
                    if (err) {
                        res.status(500).end();
                    } else {
                        res.json({ success: true,  id: this.lastID });
                    }
                });
            }
        }
    }); 
});

app.get('/api/:userid/coin/all', (req, res) => {
    const id = req.params.userid
    const result = [];
    db.each(`SELECT symbol, amount, address FROM coin WHERE id = ?`, id, function(err, row) {
        if (err) {
            res.status(500).end();
        } else {
            result.push({
                symbol: row.symbol,
                amount: row.amount,
                address: row.address,
            });
        }
    }, function (err, count) {
        res.json({ coins: result });
    });
});

app.listen(8081, () => {
    console.log('Server listens port 8081');
})