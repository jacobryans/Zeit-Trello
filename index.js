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
            let currentList = await axios.get(`https://api.trello.com/1/lists/${listId}/?key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`);
            metadata.currentList = currentList.data;
            metadata.currentCard = {};
            await zeitClient.setMetadata(metadata);
            return load_list(payload, metadata);
        }
    }

    if(payload.action.includes('open-card')){
        let cardId = payload.action.split('open-card-')[1];
        const response4 = await axios.get(`https://api.trello.com/1/cards/${cardId}?key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`);
        if (response4) {
            metadata.currentCard = response4.data;
            await zeitClient.setMetadata(metadata);
            return load_list(payload, metadata);
        }
    }

    switch(payload.action) {
        case "input_token" :
            metadata.trelloToken = payload.clientState.token;
            console.log(payload.clientState.token);
            const response = await axios.get(`https://api.trello.com/1/members/me/boards?key=e586378fdc0f7152e1d0efa486b7a346&token=${payload.clientState.token}`);
            if (response){
                const response7 = await axios.get(`https://api.trello.com/1/members/me/actions?key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`)
                metadata.picHash = response7.data[0].memberCreator.avatarHash
                metadata.trelloBoards = response.data;
                metadata.hasToken = true;
                await zeitClient.setMetadata(metadata);
                return load_content(payload, metadata);
            };
            break;
        case "reset" :
            metadata.trelloToken = '';
            break;
        case "changeBoard" :
            metadata.selected = payload.clientState.boardSelect;
            const response2 = await axios.get(`https://api.trello.com/1/boards/${metadata.selected}/lists?cards=none&card_fields=all&filter=open&fields=all&key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`)
            if(response2) {
                metadata.trelloLists = response2.data;
            }
            await zeitClient.setMetadata(metadata);
            return load_content(payload, await zeitClient.getMetadata());
        case "moveCard" :
            const response8 = await axios.put(`https://api.trello.com/1/cards/${metadata.currentCard.id}/?idList=${payload.clientState.targetList}&key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`);
            console.log(response8);
        case "add_card" :
            if (payload.clientState.new_card_name) {
                const addCardResponse = await axios.post(`https://api.trello.com/1/cards?idList=${metadata.currentList.id}&keepFromSource=all&name=${payload.clientState.new_card_name}&desc=${payload.clientState.new_card_desc}&key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`);
                if (addCardResponse) {
                    console.log(addCardResponse.data);
                    await zeitClient.setMetadata(metadata);
                    return load_list(payload, await zeitClient.getMetadata());
                }
            }
            await zeitClient.setMetadata(metadata);
            return load_list(payload, await zeitClient.getMetadata());
        
        case "edit_card" :
            let body = {
                name : payload.clientState.edit_card_name,
                desc : payload.clientState.edit_card_desc
            }
            const editCardResponse = await axios.put(`https://api.trello.com/1/cards/${metadata.currentCard.id}?key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}&response_type=token`, body);
        default :
            if(!metadata.hasToken) {
                return authenticate();
            }
            else {
                const response5 = await axios.get(`https://api.trello.com/1/members/me/boards?key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`);
                if (response5) {
                    const response6 = await axios.get(`https://api.trello.com/1/members/me/actions?key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`)
                    metadata.picHash = response6.data[0].memberCreator.avatarHash;
                    metadata.trelloBoards = response5.data;
                    await zeitClient.setMetadata(metadata);
                    return load_content(payload, metadata);
                }
            }
    }

    await zeitClient.setMetadata(metadata);

})

