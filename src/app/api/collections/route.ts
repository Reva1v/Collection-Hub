// app/api/collections/route.ts
import {NextRequest, NextResponse} from "next/server";
import {getCurrentUser} from "@/lib/auth/session.ts";
import {db} from "@/lib/db/db";
import {collections} from "@/lib/db/schema";
import {eq} from "drizzle-orm";

// GET /api/collections - получить все коллекции пользователя
export async function GET() {
    try {
        const userId = await getCurrentUser();
        const userCollections = await db.query.collections.findMany({
            where: eq(collections.userId, userId!),
            orderBy: collections.createdAt,
        });

        return NextResponse.json(userCollections);
    } catch (error) {
        console.error("Error fetching collections:", error);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        );
    }
}

// POST /api/collections - создать новую коллекцию
export async function POST(request: NextRequest) {
    try {
        const userId = (await getCurrentUser())!;

        const body = await request.json();
        const {name, description} = body;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json(
                {error: "Name is required"},
                {status: 400}
            );
        }

        const [newCollection] = await db
            .insert(collections)
            .values({
                userId: userId,
                name: name.trim(),
                description: description?.trim() || null,
            })
            .returning();

        return NextResponse.json(newCollection, {status: 201});
    } catch (error) {
        console.error("Error creating collection:", error);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        );
    }
}
