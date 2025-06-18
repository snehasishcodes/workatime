import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { projectsTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const headersList = await headers();
    const searchParams = req.nextUrl.searchParams;
    const jwtSecret = process.env.JWT_SECRET!;

    const token = headersList.get("authorization");
    if (!token) return Response.json({ project: null }, { status: 401 });

    try {
        const payload = jwt.verify(token, jwtSecret);
        const { email } = payload as { id: string, email: string };

        const id = searchParams.get("id");

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
                .where(eq(projectsTable.user_id, user.id))

        if (!id) {
            return Response.json({
                projects
            }, { status: 200 });
        } else {
            const project = projects.find((p) => p.id === id);

            return Response.json({
                project: project ?? null
            }, { status: 200 });
        }
    }
    catch (err) {
        console.error(err);
        return Response.json({ project: null }, { status: 500 })
    }
}