import { DatabaseManager } from "../src/supabase/database.js";

describe("DatabaseManager", () => {
    let db;
    beforeAll(() => {
        db = new DatabaseManager();
        
    });

    it("Insert a single record", async () => {
        const result = await db.insert("urls_metadata", {
            url: "https://jest-test.com",
        });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it("Retrieve records", async () => {
    const result = await db.getRecords("urls_metadata");
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });
});