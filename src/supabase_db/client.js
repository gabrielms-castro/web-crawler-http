const { createClient } = require('@supabase/supabase-js')
const { dbVariables } = require('./config')

function supabaseClient() {
    const config = getConfigs();
    return createClient(config.supabaseUrl, config.supabaseKey);
}

function getConfigs() {
    if (!dbVariables.supabaseURL || 
        !dbVariables.supabaseServiceRole ||
        !dbVariables.supabaseTable
    ) {
        throw new Error('Missing Supabase configuration');
    }
    
    return {
        supabaseUrl: dbVariables.supabaseURL,
        supabaseKey: dbVariables.supabaseServiceRole,
        supabaseTable: dbVariables.supabaseTable
    };
}

module.exports = {
    supabaseClient,
    getConfigs
}
