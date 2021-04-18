const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:3001'
});
(async () => {
    try {
        console.log('before');
        const response = await instance.put('/core/kb/ent', {some:'payload'});
        const {data, headers, status} = response;
        console.log(JSON.stringify({data, headers, status}, null, 3))
        console.log('after');
    } catch (e){
        console.error(e.message);
    }
})();