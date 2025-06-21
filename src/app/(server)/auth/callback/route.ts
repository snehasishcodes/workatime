import { type NextRequest } from "next/server"
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { projectsTable, usersTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) return Response.redirect(new URL("/login/error?e=code", req.url));

    try {
        const tokenParams = new URLSearchParams({
            code,
            client_id: process.env.SLACK_CLIENT_ID!,
            client_secret: process.env.SLACK_CLIENT_SECRET!,
            redirect_uri: process.env.SLACK_REDIRECT_URI!,
        });

        const tokenResponse = await fetch(
            `https://slack.com/api/oauth.v2.access?${tokenParams.toString()}`,
            { method: "POST" }
        );

        if (!tokenResponse.ok) {
            console.log(tokenResponse);
            return Response.redirect(new URL(`/login/error?e=2`, req.url));
        }

        const tokenData = await tokenResponse.json();
        console.log(tokenData);
        if (!tokenData || !tokenData?.authed_user || !tokenData?.authed_user?.access_token) return Response.redirect(new URL(`/login/error?e=access_token`, req.url));

        const access_token = tokenData?.authed_user?.access_token as string;

        const userRes = await fetch("https://slack.com/api/users.identity", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!userRes.ok) {
            console.log(userRes);
            return Response.redirect(new URL(`/login/error?e=user_identity`, req.url));
        }

        const userData = await userRes.json();
        console.log(userData);
        const user = userData?.user;

        if (!user || !user.email || !user.id) return Response.redirect(new URL(`/login/error?e=user`, req.url));

        const { id, email, name, image_192 } = user as { id: string, email: string, name: string | undefined, image_192: string | undefined };

        const jwtPayload = { id, email };
        const jwtSecret = process.env.JWT_SECRET!;
        const jwtOptions = { expiresIn: "28d" as const, issuer: "workatime" };

        const token = jwt.sign(jwtPayload, jwtSecret, jwtOptions);

        cookieStore.set({
            name: "workatime_user",
            value: token,
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 28, // 28 days
            sameSite: "strict",
        });

        let dbUser = (
            await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.email, email))
                .limit(1)
        )[0];

        if (!dbUser) {
            const newDbUser: typeof usersTable.$inferInsert = {
                id,
                email,
                name,
                avatar: image_192,
                access_token,
                created: new Date().toISOString()
            };

            await db
                .insert(usersTable)
                .values(newDbUser)
                .then(() => console.log("New User Created."))
                .catch((error) => console.error(error));

            const projectID = `${user.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

            const newProject: typeof projectsTable.$inferInsert = {
                id: projectID,
                user_id: user.id,
                name: `${name ?? "User"}'s Project`,
                created: new Date().toISOString(),
                icon: null,
                activity_images: [],
                minutes_spent: 0,
                pings: [],
            }

            await db
                .insert(projectsTable)
                .values(newProject)
                .then(() => console.log("New Project Created by ", user.email))
                .catch((e) => console.error(e));

        } else {
            await db
                .update(usersTable)
                .set({
                    access_token
                })
                .where(eq(usersTable.email, email))
                .then(() => "New User Login")
                .catch((error) => console.error(error));
        }

        return Response.redirect(new URL("/refresh", req.url));
    }
    catch (error) {
        console.error(error);
        return Response.redirect(new URL("/login/error?e=log", req.url));
    }
}