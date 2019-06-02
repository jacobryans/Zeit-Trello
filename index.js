const { withUiHook, htm } = require('@zeit/integration-utils');
const { load_content, authenticate, load_list } = require('./components.js');
const axios = require('axios');

module.exports = withUiHook(async ({ payload, zeitClient }) => {

    const metadata = await zeitClient.getMetadata();

    if(payload.action.includes('open-list')){
        let listId = payload.action.split('open-list-')[1];
        const response3 = await axios.get(`https://api.trello.com/1/lists/${listId}/cards?fields=id,name,badges,labelsv&key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`);
        if (response3) {
            metadata.trelloCards = response3.data;
            await zeitClient.setMetadata(metadata);
            return load_list(payload, metadata, response3.data);
        }
    }

    switch(payload.action) {
        case "input_token" :
            metadata.trelloToken = payload.clientState.token;
            const response = await axios.get(`https://api.trello.com/1/members/me/boards?key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`);
            if (response){
                metadata.trelloBoards = response.data;
                return load_content(payload, metadata);
            };
            break;
        case "reset" :
            metadata.trelloToken = '';
            break;
        case "changeBoard" :
            // console.log(metadata);
            metadata.selected = payload.clientState.boardSelect;
            const response2 = await axios.get(`https://api.trello.com/1/boards/${metadata.selected}/lists?cards=none&card_fields=all&filter=open&fields=all&key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`)
            if(response2) {
                console.log(response2.data);
                metadata.trelloLists = response2.data;
            }
            await zeitClient.setMetadata(metadata);
            return load_content(payload, metadata);
            console.log(metadata.trelloLists);
            break;
        case "goToCard" :
            await zeitClient.setMetadata(metadata);
            return load_content(payload, metadata);
        default :
            return authenticate();
    }

    await zeitClient.setMetadata(metadata);

})

