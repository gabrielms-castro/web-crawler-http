const { getConfigs } = require('./client')

async function insertData(client, data) {
    const config = getConfigs();
    const response = await client.from(config.supabaseTable).insert(data);
    
    if (response.error) {
        throw new Error(`Insert Failed: ${JSON.stringify(response.error)}`);
    }
    return response;
}

module.exports = {
    insertData
}