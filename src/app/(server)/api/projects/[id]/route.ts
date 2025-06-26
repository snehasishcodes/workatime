import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { projectsTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const headersList = await headers();
    const { id } = await params;
    const jwtSecret = process.env.JWT_SECRET!;

    const token = headersList.get("authorization");
    if (!token) return Response.json({ project: null }, { status: 401 });
    if (!id) return Response.json({ project: null }, { status: 400 });

    try {
        const payload = jwt.verify(token, jwtSecret);
        const { email } = payload as { id: string, email: string };

        const user = (
            await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.email, email))
                .limit(1)
        )[0];

        if (!user) return Response.json({ project: null }, { status: 404 });

        const projects =
            await db
                .select()
                .from(projectsTable)
                .where(eq(projectsTable.user_id, user.id));

        const project = projects.find((p) => p.id === id);

        if (!project) return Response.json({ project: null }, { status: 404 });

        return Response.json({
            project: {
                ...project,
                minutes_spent: Math.round(Number(project.minutes_spent ?? 0))
            }
        }, { status: 200 });
    }
    catch (err) {
        console.error(err);
        return Response.json({ project: null }, { status: 500 })
    }
}