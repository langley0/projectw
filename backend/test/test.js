const axios = require('axios');

async function test() {
    let res;
    res = await axios.post('http://localhost:8081/api/login', { name: 'test'});
    console.log(res.data);
    res = await axios.post('http://localhost:8081/api/login', { name: 'test1'});
    console.log(res.data);

    res = await axios.get('http://localhost:8081/api/1/coin/all');
    console.log(res.data);

    if (!res.data.coins.find(e => e.symbol === "BTC")) {
        res = await axios.post('http://localhost:8081/api/1/coin/add', { symbol: "BTC" });
        console.log(res.data);
    }

    res = await axios.get('http://localhost:8081/api/1/friends');
    console.log(res.data);

    res = await axios.post('http://localhost:8081/api/1/coin/__devget', { symbol: "BTC" });
    console.log(res.data);

    res = await axios.post('http://localhost:8081/api/1/coin/send', { target:2, symbol: "BTC", amount: "1" });
    console.log(res.data);
}

test();