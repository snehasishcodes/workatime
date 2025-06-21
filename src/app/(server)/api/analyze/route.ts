import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { projectsTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function POST(req: Request) {
    const headersList = await headers();
    const jwtSecret = process.env.JWT_SECRET!;

    const token = headersList.get("authorization");
    if (!token) return Response.json({ success: false }, { status: 401 });

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
        if (!user) return Response.json({ success: false }, { status: 404 });

        const { project_id, activity, image_url } = await req.json();

        // console.log(project_id, activity, image_url);

        if (!project_id) return Response.json({ success: false }, { status: 400 });
        if (!image_url) return Response.json({ success: false }, { status: 400 });
        if (!activity) return Response.json({ success: false }, { status: 400 });

        const project = (
            await db
                .select()
                .from(projectsTable)
                .where(eq(projectsTable.id, project_id))
                .limit(1)
        )[0];

        if (!project || !project.id) return Response.json({ success: false }, { status: 404 });
        console.log(5);
        if (project.user_id !== user.id) return Response.json({ success: false }, { status: 401 });

        const model = google("gemini-2.0-flash");
        const { object, usage } = await generateObject({
            model,
            schema: z.object({
                activity_ongoing: z.boolean(),
                activity_ongoing_probability: z.number()
                    .min(0, { message: "Must be at least 0" })
                    .max(1, { message: "Must be at most 1" })
                    .refine((val) => Number(val.toFixed(2)) === val, {
                        message: "Must have at most 2 decimal places",
                    })
            }),
            system: `
            Analyze the given image and determine:
            1. Is a real person present (not a recording or image)?
            2. Is the person actively performing the specified task?

            Respond with:
            - activity_ongoing: true | false
            - activity_ongoing_probability: number (0 to 1) (upto 2 decimal places)

            Only use visible evidence from the current image.
        `,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Activity Details: ${activity}`
                        },
                        {
                            type: "image",
                            image: image_url,
                            // mimeType: "image/png"
                        }
                    ]
                }
            ]
        });

        console.log(object, usage);

        const { activity_ongoing, activity_ongoing_probability } = object;

        if (activity_ongoing === true) {
            await db
                .update(projectsTable)
                .set({
                    minutes_spent: Number(((project.minutes_spent ?? 0) + 0.25).toFixed(2)),
                    pings: [
                        {
                            activity_ongoing,
                            activity_ongoing_probability,
                            activity_image: ``,
                            at: new Date().toISOString(),
                            usage,
                        },
                        ...(project.pings as any[])
                    ]
                })
                .where(eq(projectsTable.id, project.id));

            return Response.json({ success: true, activity_ongoing, activity_ongoing_probability });
        } else {
            await db
                .update(projectsTable)
                .set({
                    // no incrementing minutes_spent 
                    pings: [
                        {
                            activity_ongoing,
                            activity_ongoing_probability,
                            activity_image: ``,
                            at: new Date().toISOString(),
                            usage,
                        },
                        ...(project.pings as any[])
                    ]
                })
                .where(eq(projectsTable.id, project.id));

            return Response.json({
                success: true,
                activity_ongoing,
                activity_ongoing_probability
            });
        }
    }
    catch (err) {
        console.log(err)
        return Response.json({}, { status: 500 });
    }
}