import {pgTable, text, varchar} from "drizzle-orm/pg-core";

export const energetic = pgTable("energetic", {
    id: varchar("id", {length: 36}).primaryKey(),
    description: text("description").notNull(),
    image: text("image").notNull(),
    collect: text("collect", {
        enum: ["unknown", "collected", "will-not-collect"],
    }).notNull(),
    type: text("type").notNull(),
});
