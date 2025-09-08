import { getSupabaseClient } from "./client.js";

export class DatabaseManager {

    constructor () {
        this.supabaseClient = getSupabaseClient();
    }

    async insert (table, record) {
        try {
            const { data, error } = await this.supabaseClient
                .from(table)
                .insert(record)

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getRecords (table) {
        try {
            const { data, error } = await this.supabaseClient
                .from(table)
                .select('*')
            
            if (error) throw error;
            return { success: true, data};
        } catch (error) {
            return { success: false, error: error.message};
        }
    }
}
