const axios = require('axios');

//Function for setting up our headers for requests to protected endpoints
module.exports = axiosWithAuth;

function axiosWithAuth (token) {
    return axios.create({
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
        }
    })
}