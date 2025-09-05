const dotenv =require('dotenv')
dotenv.config()

const dbVariables = {
  supabaseEndpoint: process.env.ENDPOINT,
  supabaseServiceRole: process.env.SERVICE_ROLE
}

module.exports = {
  dbVariables
}