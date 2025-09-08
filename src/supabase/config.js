import dotenv from 'dotenv'
dotenv.config()

export const supabaseVariables = {
  URL: process.env.SUPABASE_URL,
  ServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  AnonKey: process.env.SUPABASE_ANON_KEY,
  StorageEndpoint: process.env.SUPABASE_STORAGE_ENDPOINT,
  StorageAccessKeyID: process.env.SUPABASE_STORAGE_ACCESS_KEY_ID,
  StorageSecretAccessKey: process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY,
}