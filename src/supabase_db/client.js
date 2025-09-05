const { createClient } = require('@supabase/supabase-js')
const { dbVariables } = require('./config')

function supabaseclient() {
    const config = getConfigs(dbVariables);
    return createClient(config.supabaseUrl, config.supabaseKey);
}

function getConfigs(cfg) {
    if (!cfg.supabaseEndpoint || !cfg.supabaseServiceRole) {
        throw new Error('Missing Supabase configuration');
    }
    return {
        supabaseUrl: cfg.supabaseEndpoint,
        supabaseKey: cfg.supabaseServiceRole
    };
}

module.exports = {
    supabaseclient
}
