import { db } from "./db.ts";
import { energetic } from "./schema.ts";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";

async function main() {
    // await db.insert(energetic).values({
    //     id: randomUUID(),
    //     description: "Example item",
    //     image: "https://example.com/image.png",
    //     collect: "unknown",
    //     type: "Original",
    // });

    const energetics = JSON.parse(
        readFileSync(new URL("../assets/data/energetics.json", import.meta.url), "utf-8")
    );

    for (const item of energetics) {
        await db.insert(energetic).values({
            id: randomUUID(),
            description: item.description,
            image: item.image,
            collect: "unknown",
            type: item.type,
        });
    }

    const items = await db.select().from(energetic);
    console.log(items);
}

main().catch(console.error);
