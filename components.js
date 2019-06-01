const { htm } = require('@zeit/integration-utils');

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
                            <Link target="_blank" href="https://trello.com/1/authorize?expiration=never&name=MyPersonalToken&scope=read&response_type=token&key=e586378fdc0f7152e1d0efa486b7a346">
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

const load_content = (trelloUser) => {
    return htm`
        <Page>
            <Box width="100%" padding="5px" height="30px" display="flex" justifyContent="space-between"> 
                <Container>
                    Hi Username
                </Container>

                <Select name="boardSelect" value="selectedValue" action="change-board">
                    Board to use: ${trelloUser.map(board => mapBoards(board))}
                </Select>
            </Box>

            <Box width="100%" display="flex" padding="5px">
                <Box width="75px" justifyContent="flex-start" padding="5px" borderRadius="5px">
                    card content
                    <Button action="goToCard">Use this Card</Button>
                </Box>
            </Box>
        </Page>
    `;
}

mapBoards = board => {
    return htm`
        <Option value="${board.id}" caption="${board.name}" />
    `
  }

module.exports = {
    authenticate, load_content
}