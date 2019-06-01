const { withUiHook, htm } = require('@zeit/integration-utils');
const axios = require('axios');

module.exports = withUiHook(async ({ payload, zeitClient }) => {
    const metadata = await zeitClient.getMetadata();

    const fetch = () => {
        axios.get(`https://api.trello.com/1/members/me/boards?key=e586378fdc0f7152e1d0efa486b7a346&token=${metadata.trelloToken}`)
        .then(response => {
            metadata.trelloUser = response.data;
            console.log(metadata.trelloUser);
        })
    }

    if(payload.action === "input_token") {
        metadata.trelloToken = payload.clientState.token;
        fetch();
    }

    if(payload.action === "reset") {
        metadata.trelloToken = '';
    }

    await zeitClient.setMetadata(metadata);

    return htm`
    <Page>
        <P>Start of project</P>
        <Box border="1px solid black" borderRadius="5px" display="flex" flexWrap="wrap" padding="5px" justifyContent="center">
            <Box width="50%" >
                <Input label="User Token" name="token" value=${payload.clientState.token ? payload.clientState.token : "Token"}></Input>
            </Box>
            <Box width="50%">
                <Button action="input_token">Fetch Trello</Button>
                <Button action="reset">Reset</Button>
            </Box>
        </Box>
    </Page>
    `
})

