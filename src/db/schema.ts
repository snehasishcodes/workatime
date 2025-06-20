import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";

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
    minutes_spent: integer("minutes_spent").notNull().default(0),
    pings: jsonb("pings").default([]),
});