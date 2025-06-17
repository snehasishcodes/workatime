import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    const headersList = await headers();
    const jwtSecret = process.env.JWT_SECRET!;

    const token = headersList.get("authorization");
    // console.log(token);
    if (!token) return Response.json({ user: null }, { status: 401 });

    const payload = jwt.verify(token, jwtSecret);
    const { email } = payload as { id: string, email: string };

    const user = (
        await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1)
    )[0];

    if (!user) return Response.json({ user: null }, { status: 404 });

    return Response.json({
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            created: user.created
        }
    }, {
        status: 200
    });
}