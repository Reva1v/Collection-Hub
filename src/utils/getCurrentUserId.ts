import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {db} from "@/db/db.ts";
import {sessions} from "@/db/schema.ts";
import {eq} from "drizzle-orm";

export async function getCurrentUserId(): Promise<string | NextResponse> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        return NextResponse.json({error: "Not authenticated"}, {status: 401});
    }

    const session = await db
        .select()
        .from(sessions)
        .where(eq(sessions.token, token))
        .limit(1);

    if (session.length === 0) {
        return NextResponse.json({error: "Invalid session"}, {status: 401});
    }

    return session[0].userId;
}
