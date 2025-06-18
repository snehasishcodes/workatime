import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { projectsTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    const headersList = await headers();
    const jwtSecret = process.env.JWT_SECRET!;

    const token = headersList.get("authorization");
    if (!token) return Response.json({ project: null }, { status: 401 });

    const payload = jwt.verify(token, jwtSecret);
    const { email } = payload as { id: string, email: string };

    const { name } = await req.json() as { name: string };

    if (!name || typeof name !== "string") return Response.json({ project: null }, { status: 400 });

    const user = (
        await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1)
    )[0];

    if (!user) return Response.json({ project: null }, { status: 404 });

    const projectID = `${user.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const newProject: typeof projectsTable.$inferInsert = {
        id: projectID,
        user_id: user.id,
        name,
        created: new Date().toISOString(),
        icon: null,
        minutes_spent: 0,
        pings: 0,
        last_ping: new Date().toISOString()
    }

    await db
        .insert(projectsTable)
        .values(newProject)
        .then(() => console.log("New Project Created by ", user.email))
        .catch((e) => console.error(e));

    return Response.json({ project: newProject }, { status: 201 });

}