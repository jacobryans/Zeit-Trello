const { withUiHook, htm } = require('@zeit/integration-utils');
const { authenticate, load_content } = require('./components.js');
const axios = require('axios');

module.exports = withUiHook(async ({ payload, zeitClient }) => {
    const metadata = await zeitClient.getMetadata();

    switch(payload.action) {
        case "input_token" :
            metadata.trelloToken = payload.clientState.token;
            const response = await axios.get(`https://api.trello.com/1/members/me/boards?key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`);
            if (response){
                metadata.trelloUser = response.data;
                return load_content(metadata.trelloUser);
            }
        case "reset" :
            metadata.trelloToken = '';
            break;
        default :
            return authenticate();
    }

    await zeitClient.setMetadata(metadata);

})

