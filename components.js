const { htm } = require('@zeit/integration-utils');
const axios = require('axios');

{/* <Option value="" caption=${findBoard(metadata, zeitUser)} /> */}

const authenticate = () => {
    return htm`
    <Page>
        <Box backgroundColor="#e1e7f2" width="50vw" margin="0 auto">
            <Box height="350px" border="1px solid #a9a9aa" borderRadius="5px" display="flex" flexWrap="wrap" padding="10px" justifyContent="center">
                <Box height="250px" width="100%" display="flex" flexWrap="wrap" justifyContent="center" fontWeight="bold" alignItems="flex-start">
                    <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="space-between">
                        <Img width="40%" height="80px" src="https://d2k1ftgv7pobq7.cloudfront.net/meta/u/res/images/brand-assets/Logos/0099ec3754bf473d2bbf317204ab6fea/trello-logo-blue.png" />
                        <P width="100%"> Welcome to the Zeit Trello Integration! Click the "Fetch Trello" button below to get started. </P>
                        <Box width="100%" textAlign="center" marginBottom="20px">
                            <Link target="_blank" href="https://trello.com/1/authorize?expiration=never&name=MyPersonalToken&scope=read,write,account&response_type=token&key=e586378fdc0f7152e1d0efa486b7a346">
                                Click here to get your token.
                            </Link>
                        </Box>
                        <Input width="30vw" label="User Token" name="token" value=""></Input>
                    </Box>
                </Box>
                <Box width="100%" display="flex" justifyContent="space-around" alignItems="center" padding="0px 50px">
                    <Button action="input_token">Fetch Trello</Button>
                    <Button action="reset">Reset</Button>
                </Box>
            </Box>
        </Box>
    </Page>
    `
}

const load_content = (zeitUser, metadata) => {
    let selectedBoard = (metadata.selected ? metadata.trelloBoards.filter(board => metadata.selected === board.id) : [metadata.trelloBoards[0]]);
    let selectComponent = (!metadata.selected ? htm`<Option value="" caption="${metadata.trelloBoards[0].name}" selected />` : htm`<Option value="" caption="${selectedBoard[0].name}" selected />`);
    let picLink = `https://trello-avatars.s3.amazonaws.com/${metadata.picHash}/30.png`;
    return htm`
        <Page>
            <Box fontSize="16px" fontWeight="bolder" color="white" backgroundColor="#008FE4" width="100%" border="1px solid #a9a9aa" padding="5px" height="50px" display="flex" justifyContent="space-between" borderRadius="5px 5px 0px 0px" alignItems="center"> 
                <Box width="18%" display="flex" height="100%" alignItems="center" justifyContent="space-around">
                    <Box overflow="hidden" borderRadius="50%">
                        <Img src=${picLink} />
                    </Box>
                    Hello, ${zeitUser.user.username}
                </Box>

                <Box fontSize="16px" width="41.75%" display="flex" justifyContent="space-around" alignItems="center">
                    Board to use: 
                    <Select name="boardSelect" value="selectedValue" action="changeBoard">
                        ${selectComponent}
                        ${metadata.trelloBoards.map(board => { 
                            if(selectedBoard[0].id !== board.id) {
                                return htm`<Option value="${board.id}" caption="${board.name}"/>`
                            } else {
                                return;
                            }
                        }
                        )}
                    </Select>
                </Box>
            </Box>
            
            ${!metadata.selected ? htm`<Box height="300px" fontSize="40px" fontWeight="bold" display=${!metadata.selected ? "flex" : "none"} justifyContent="center" alignItems="center">
            <P> Please select a board to continue. </P>
            </Box>` : ""}

            <Box width="100%" display="${!metadata.selected ? "none" : "flex"}" padding="5px" border="1px solid #a9a9aa" justifyContent="space-around" flexWrap="wrap">
                ${ metadata.trelloLists && 
                    metadata.trelloLists.map(list => { 
                    return htm`<Box fontSize="16px" fontWeight="bold" width="23%" height="125px" padding="5px" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" margin="5px" borderRadius="5px" border="1px solid #a9a9aa">
                                    ${list.name}
                                    <Box margin="0 0 10px 0">
                                        <Button width="5%" height="5px" display="flex" fontSize="8px" value="test" action="open-list-${encodeURIComponent(`open-list-${list.id}`)}"> Use this List </Button>
                                    </Box>
                                </Box>`;
                    })
                }
            </Box>
        </Page>
    `;
}

const load_list = (zeitUser, metadata ) => {
    let picLink = `https://trello-avatars.s3.amazonaws.com/${metadata.picHash}/30.png`;
    return htm`
    <Page>
        <Box fontWeight="bolder" color="white" fontSize="16px" width="100%" border="1px solid #a9a9aa" padding="5px" display="flex" justifyContent="space-between" borderRadius="5px" backgroundColor="#008FE4" alignItems="center"> 
                <Box margin="0 0 0 5px" width="17%" display="flex" height="100%" alignItems="center" justifyContent="space-around">
                    <Box overflow="hidden" borderRadius="50%">
                        <Img src=${picLink}/>
                    </Box>
                    Hello, ${zeitUser.user.username}
                </Box>
                <Box margin="0 15px 0 0" width="73%" display="flex" justifyContent="flex-end" flexDirection="row" alignItems="center">
                    <Box margin="0px 15px 0 0">
                        <P> Selected List - ${metadata.currentList.name} </P>
                    </Box>
                    <Button small>Back To Lists</Button>
                </Box>
        </Box>

        <Box width="100%" display="flex" borderRadius="5px" justifyContent="space-between" flexWrap="wrap">
            <Box padding="0px 25px 0 0" borderRight="1px solid #a9a9aa" width="47.5%" display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center" alignContent="flex-start" margin="5px 5px 5px 10px">
                <Box width="100%" backgroundColor="#008FE4" height="50px"  margin="5px 0 0 0" borderRadius="5px" padding="5px" fontWeight="bold" display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                    <Button small action="add_card">ADD NEW CARD</Button>
                </Box>
                ${ metadata.trelloCards && 
                    metadata.trelloCards.map(card => {
                        let cardName = '';
                        cardName = (card.name.length > 45 ? (card.name.substring(0,45) + '...') : card.name);
                        return htm`<Box width="100%" height="100px" border="1px solid #a9a9aa" margin="5px 0 0 0" borderRadius="5px" padding="5px 15px" fontSize="14px" fontWeight="bold" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                                        <Box height="35px" display="flex" alignItems="center">${cardName}</Box>
                                        <Button small action="open-card-${encodeURIComponent(`open-card-${card.id}`)    }">Select</Button>
                                    </Box>`
                    })
                }
            </Box>
            <Box height="500px" padding="0px 5px" width="50%" display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center">
                ${action_panel(zeitUser, metadata)}
            </Box>
        </Box>
    </Page>
    `;
};

const action_panel = (zeitUser, metadata) => {
    if(zeitUser.action==="add_card") {
        return   htm`
                    <Box margin="20px 0 0 0" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center" >
                        <Input name="new_card_name" label="New Card Name" value="" />
                        <Input name="new_card_desc" label="New Card Description" value="" />
                        <Button action="add_card">Add Card</Button>
                    </Box>
                `;
    }
    if(!metadata.currentCard.name) {
        return htm`
            <Box display="flex" flexWrap="wrap" flexDirection="column" justifyContent="space-around" alignItems="center" width="40%" margin="20px" height="400px" fontSize="40px">
                <P> Please </P>
                <P> select </P>
                <P> a </P>
                <P> card </P>
                <P> to </P>
                <P> continue. </P>
            </Box>
        `;
    }
    let selectComponent = htm`<Option value="" caption="${metadata.currentList.name}" selected />`;
    return htm`
        <Box width="100%" margin="0" borderRadius="5px" padding="5px" fontWeight="bold" display="flex" flexDirection="row" justifyContent="center" alignItems="center">
            ${metadata.currentCard.name}
        </Box>
        <Box width="90%">
            <Box>
                <Input width="100%" name="edit_card_name" label="Card Name" value="${metadata.currentCard.name}" />
                <Textarea width="90%" name="edit_card_desc" label="Card Description">${metadata.currentCard.desc}</Textarea>
                <Box width="100%" display="flex" flexWrap="wrap">
                    <Box width="47.5%">
                        <Checkbox name="completed" label="Mark Complete" checked="false" />
                    </Box>
                    <Select name="targetList" value="selectedValue" action="moveCard">
                        ${selectComponent}
                        ${metadata.trelloLists.map(list => { 
                            if(metadata.currentList.id !== list.id) {
                                return htm`<Option value="${list.id}" caption="${list.name}"/>`
                            } else {
                                return;
                            }
                        }
                        )}
                    </Select>
                    <Box width="40%">
                        <Button action="edit_card">SAVE CARD</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    `;
}

module.exports = {
    authenticate, load_content, load_list
}

