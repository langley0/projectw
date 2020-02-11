const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const crypto = require('crypto');


const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db  .run(`CREATE TABLE account (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT, phone Text);`)
        .run(`CREATE TABLE coin (id INTEGER, symbol TEXT, amount TEXT, address TEXT, PRIMARY KEY(id, symbol));`)
    //;
});

const app = express();
app.use(bodyParser.json())

app.post('/api/login', (req, res)  => {
    const token = req.body.token;
    console.log('login', token);
    db.get(`SELECT id FROM account WHERE token = ?`, [token], function (err, row)  {
        if (err) {
            res.status(500).end();
        } else {
            if (row) {
                res.json({ success: true,  registered: true, id: row.id });
            } else {
                res.json({success: true, registered: false})
            }
        }
    }); 
});

app.post('/api/register', (req, res) => {
    const token = req.body.token;
    const phone = req.body.phone;
    console.log('register', token, phone);
    db.run(`INSERT INTO account (token, phone) VALUES (?, ?)`, token, phone, function (err) {
        if (err) {
            res.status(500).end();
        } else {
            res.json({ success: true,  id: this.lastID });
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

app.post('/api/:userid/coin/add', (req, res) => {
    const id = req.params.userid;
    const symbol = req.body.symbol;

    // 랜덤어드레스를 생성한다
    const address = crypto.randomBytes(32).toString('hex');
    
    db.run(`INSERT INTO coin(id, symbol, amount, address) VALUES (?, ?, ?, ?)`, id, symbol, "0", address, 
    function(err) {
        if (err) {
            res.status(500).end();
        } else {
            console.log('coin add', symbol, address);
            res.json({
                success: true,
                symbol: symbol,
                amount: "0",
                address: address,
            });
        }
    });
});

app.get('/api/:userid/friends', (req, res) => {
    const id = req.params.userid;
    const result = [];
    db.each(`SELECT token, phone FROM account WHERE id <> ?`, id , function(err, row) {
        if (err) {
            // 
            console.log(err);
        } else {
            result.push({
                id: row.token,
                phone: row.phone,
            })
        }
    }, function (err, count) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else {
            console.log(result);
            res.json({ friends: result }) 
        }
    });
});

app.post('/api/:userid/coin/__devget', (req, res)=>{
    const id = req.params.userid;
    const symbol = req.body.symbol;
    
    db.get(`SELECT amount, address FROM coin WHERE id = ? AND symbol = ?`, id, symbol, function(err, row) {
        if (err) {
            res.status(500).end();
        } else {
            if (row) {
            // 나중에 빅넘버로 바꾼다. 지금은 괜찮.
            const amount = (Number(row.amount) + 10).toString();
            db.run(`UPDATE coin SET amount = ? WHERE id = ? AND symbol = ?`, amount, id, symbol, function(err) {
                if (err) {
                    res.status(500).end();
                } else {
                    res.json({
                        success: true,
                        amount: amount,
                    })
                }
            });
        } 
        }
    });
});

app.post('/api/:userid/coin/send', (req, res) => {
    const id = req.params.userid;
    const symbol = req.body.symbol;
    const target = req.body.target;
    const amount = req.body.amount;

    console.log(id, symbol, target, amount);

    const response = function() {
        db.get(`SELECT * FROM coin WHERE id = ? AND symbol = ?;`, id, symbol, function(err, row) {
            if (err) {
                res.status(500).end();
            } else {
                res.json({
                    success: true,
                    amount: row.amount
                });
            }
        });
    }

    db.serialize(function () {
        db.get(`SELECT * FROM coin WHERE id = ? AND symbol = ?;`, target, symbol, function(err, row) {
            if (err) {
                res.status(500).end()
                return;
            }

            if (row) {
                db.run(`UPDATE coin SET amount = CAST(amount AS INTEGER) - ? WHERE id = ? AND symbol = ?;`, Number(amount), id, symbol)
                .run(`UPDATE coin SET amount = CAST(amount AS INTEGER) + ? WHERE id = ? AND symbol = ?;`, Number(amount), target, symbol, function(err) {
                    if (err) {
                        res.status(500).end()
                    } else {
                        response();
                    }
                });
            } else {
                const address = crypto.randomBytes(32).toString('hex');

                db.run(`UPDATE coin SET amount = CAST(amount AS INTEGER) - ? WHERE id = ? AND symbol = ?;`, Number(amount), id, symbol)
                .run(`INSERT INTO coin(id, symbol, amount, address) VALUES (?, ?, ?, ?);`, target, symbol, amount, address, function(err) {
                    if (err) {
                        res.status(500).end()
                    } else {
                        response();
                    }
                });
            }
        });
    });
});

app.listen(8088, () => {
    console.log('Server listens port 8088');
})