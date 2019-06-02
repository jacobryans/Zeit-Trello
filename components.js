const { htm } = require('@zeit/integration-utils');
const axios = require('axios');
const axiosWithAuth = require('./axiosAuth');

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
                            <Link target="_blank" href="https://trello.com/1/authorize?expiration=never&name=MyPersonalToken&scope=read,write&response_type=token&key=e586378fdc0f7152e1d0efa486b7a346">
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
    console.log(metadata.trelloBoards);
    let selectedBoard = metadata.trelloBoards.filter(board => metadata.selected === board.id);
    let selectComponent = htm`<Option value="" caption="${selectedBoard[0].name}" selected />`;
    return htm`
        <Page>
            <Box width="100%" border="1px solid #a9a9aa" padding="5px" height="50px" display="flex" justifyContent="space-between" border-radius="5px" alignItems="center"> 
                <Container display="flex" height="100%" align-items="center">
                    Hello, ${zeitUser.user.username}
                </Container>

                <Container>
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
                </Container>
            </Box>

            <Box width="100%" display="flex" padding="5px" border="1px solid #a9a9aa" justifyContent="flex-start" flexWrap="wrap">
                
            ${ metadata.trelloLists && 
                metadata.trelloLists.map(list => { 
                    return htm`<Box width="150px" padding="5px" margin="5px" borderRadius="5px" border="1px solid #a9a9aa">
                    <Container>
                        ${list.name}
                        <Button width="5%" height="5px" fontSize="8px" value="test" action="open-list-${encodeURIComponent(`open-list-${list.id}`)}"> Use this List </Button>
                    </Container>
                </Box>`
                })
            }
            </Box>
        </Page>
    `;
}

const load_list = (zeitUser, metadata ) => {
    console.log(metadata.trelloCards);
    return htm`
    <Page >
        <Box height="600px" width="100%" border="1px solid #a9a9aa" padding="5px" height="50px" display="flex" justifyContent="flex-start" border-radius="5px" alignItems="center"> 
            <Container display="flex" height="100%" align-items="center">
                Hello, ${zeitUser.user.username}
            </Container>
        </Box>

        <Box width="100%" display="flex" padding="5px" margin="5px" border="1px solid #a9a9aa" justifyContent="space-between" flexWrap="wrap">
            <Box width="50%" display="flex" flex-direction="row" flexWrap="wrap">
                <Box width="45%" height="130px" border="1px solid #a9a9aa" margin="5px 0 0 0" borderRadius="5px" padding="3px" fontSize="8px" fontWeight="bold">
                    <Button height="30px" small action="add_card">ADD CARD</Button>
                </Box>
            ${ metadata.trelloCards && 
                metadata.trelloCards.map(card => {
                    return htm`<Box width="45%" height="130px" border="1px solid #a9a9aa" margin="5px 0 0 0" borderRadius="5px" padding="3px" fontSize="8px" fontWeight="bold">
                        <P>${card.name.substring(0,30) + "..."}</P>
                        <Button small action="open-card-${encodeURIComponent(`open-card-${card.id}`)}">Select</Button>
                    </Box>` 
                })
            }
            </Box>
            <Box width="50%" display="flex">
                ${action_panel(zeitUser, metadata)}
            </Box>
        </Box>
    </Page>
    `;
}

const action_panel = (zeitUser, metadata) => {
    if(zeitUser.action==="add_card") {
        return   htm`
                    <Box>
                        <Input name="new_card_name" label="New Card Name" value="" />
                        <Input name="new_card_desc" label="New Card Description" value="" />
                        <Button action="add_card">Add Card</Button>
                    </Box>
                `;
    }
    return htm`
        <Box width="100%">
            <P>Name - ${metadata.currentCard.name}</P>
            <P>Description - ${metadata.currentCard.desc}</P>
            <P>Content</P>
            <P>Content</P>
            <P>Content</P>
            <Box>
                <Input name="edit_card_name" label="Card Name" value="${metadata.currentCard.name}" />
                <Input name="edit_card_desc" label="Card Description" value="${metadata.currentCard.desc}" />
                <Button action="edit_card">SAVE CARD</Button>
            </Box>
        </Box>
    `;
}

module.exports = {
    authenticate, load_content, load_list
}