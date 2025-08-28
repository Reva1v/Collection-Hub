import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// Таблица пользователей
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Сессии
export const sessions = pgTable("sessions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),

});

// Коллекции
export const collections = pgTable("collections", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),

});

// Элементы коллекций
export const items = pgTable("items", {
    id: uuid("id").defaultRandom().primaryKey(),
    collectionId: uuid("collection_id")
        .notNull()
        .references(() => collections.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    image: text("image"),
    type: text("type"),
    collectStatus: text("collect_status").$type<
        "unknown" | "collected" | "will-not-collect"
    >().default("unknown"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
