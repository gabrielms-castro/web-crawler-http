import { createClient } from '@supabase/supabase-js';
import { supabaseVariables } from './config.js';

export class SupabaseClient {
  
  constructor () {
    this.client = null;
    this.config = this.getConfigs();
    this.initClient();
  }

  getConfigs() {
      if (!supabaseVariables.URL || 
          !supabaseVariables.ServiceRoleKey ||
          !supabaseVariables.AnonKey ||
          !supabaseVariables.StorageEndpoint ||
          !supabaseVariables.StorageAccessKeyID ||
          !supabaseVariables.StorageSecretAccessKey
      ) {
          throw new Error('Missing Supabase configurations');
      }
      
      return supabaseVariables
  }

  initClient() {
    this.client = createClient(this.config.URL, this.config.ServiceRoleKey);
  }

  getClient () {
    return this.client;
  } 
}

// Instance
let supabaseClient = null
export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = new SupabaseClient();
  }
  return supabaseClient  
}