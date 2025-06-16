import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer } from "drizzle-orm/pg-core";

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
    minutes_spent: integer("minutes_spent"),
    pings: integer("pings"),
    last_ping: text("last_ping").default(sql`CURRENT_TIMESTAMP`).notNull(),
    created: text("created").default(sql`CURRENT_TIMESTAMP`).notNull(),
});