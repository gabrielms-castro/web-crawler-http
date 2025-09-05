const dotenv =require('dotenv')
dotenv.config()

const dbVariables = {
  supabaseURL: process.env.SUPABASE_URL,
  supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE,
  supabaseTable: process.env.SUPABASE_TABLE
}


module.exports = {
  dbVariables
}