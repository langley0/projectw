const axios = require('axios');

async function test() {
    let res;
    res = await axios.post('http://localhost:8081/api/login', { name: 'test'});
    console.log(res.data);
    res = await axios.post('http://localhost:8081/api/login', { name: 'test1'});
    console.log(res.data);

    res = await axios.get('http://localhost:8081/api/1/coin/all');
    console.log(res.data);
}

test();