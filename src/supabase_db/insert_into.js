const { supabaseclient } = require('./client')

async function insertData(client, table, data) {
    const insert = await client.from(table).insert(data);
    console.log(insert)
}

module.exports = {
    insertData
}