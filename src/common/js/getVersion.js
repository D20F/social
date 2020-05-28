import axios from 'axios';



const url = 'http://112.74.165.87:4568/versionInfo.json';
let headers = {};
if (process.env.NODE_ENV != 'development') {
    headers = {
        'Cache-Control': 'no-cache'
    };
}

async function getversion() {
    let res = await axios({method: 'get', headers: headers, url: url});
    return  res.data
}





export default getversion;