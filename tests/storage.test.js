import { StorageManager } from "../src/supabase/storage";

describe("StorageManager", () => {
    let storage;

    beforeAll(() => {
        storage = new StorageManager();
    });

    it("Upload a file and return public URL", async () => {
        const result = await storage.uploadFile("teste.html", 
            "<h1>Título H1</h1>",
            "html-data",
            "text/html",
            true
        );
        expect(result.success).toBe(true);
        expect(result.signedUrl).toContain("download=teste.html")
    });
});