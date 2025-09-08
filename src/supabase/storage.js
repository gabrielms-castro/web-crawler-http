import { getSupabaseClient } from "./client.js";

export class StorageManager {
    constructor () {
        this.supabaseClient = getSupabaseClient();
    }

    async uploadFile(fileName, fileContent, bucket, contentType, upsert) {
        if (!fileName ||
            !fileContent ||
            !bucket
        ) {
            return { success: false, error: "Missing required parameters" }
        }
        try {
            const { data, error } = await this.supabaseClient.storage
                .from(bucket)
                .upload(fileName, fileContent, {
                    contentType: contentType,
                    upsert: upsert
                });

            if (error) throw error;

            const { data: signedData, error: signedError } = await this.supabaseClient.storage
                .from(bucket)
                .createSignedUrl(fileName, 31536000, {
                    download: fileName,
                });
            
            if (signedError) throw signedError
            
            return {
                success: true,
                data,
                signedUrl: signedData.signedUrl
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async downloadFile(fileName, bucket) {
        try {
            const { data, error } = await this.supabaseClient.storage
                .from(bucket)
                .download(fileName);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }    
}