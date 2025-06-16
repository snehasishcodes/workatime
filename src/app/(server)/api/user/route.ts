import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    const cookieStore = await cookies();
    const jwtSecret = process.env.JWT_SECRET!;

    const token = cookieStore.get("workatime_user")?.value;
    if (!token) return Response.json({ user: null }, { status: 401 });

    const payload = jwt.verify(token, jwtSecret);
    const { id, email } = payload as { id: string, email: string };

    
}