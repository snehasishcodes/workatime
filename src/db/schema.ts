import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, jsonb } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: text("id").primaryKey(),
    email: varchar({ length: 255 }).notNull().unique(),
    name: varchar({ length: 255 }),
    avatar: text("avatar"),
    access_token: varchar("access_token", { length: 512 }).notNull(),
    created: text("created").default(sql`CURRENT_TIMESTAMP`).notNull()
});

export const projectsTable = pgTable("projects", {
    id: text("id").primaryKey(),
    user_id: text("user_id").notNull().references(() => usersTable.id),
    name: varchar({ length: 255 }),
    icon: text("icon"),
    created: text("created").default(sql`CURRENT_TIMESTAMP`).notNull(),

    activity_images: jsonb("activity_images").default([]),
    minutes_spent: numeric("minutes_spent", { precision: 10, scale: 2 }).notNull().default("0.00"),
    pings: jsonb("pings").default([]),
});