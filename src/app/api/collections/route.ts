// app/api/collections/route.ts
import {NextRequest, NextResponse} from "next/server";
import {getSession} from "@/app/auth/session-db";
import {db} from "@/db/db";
import {collections} from "@/db/schema";
import {eq} from "drizzle-orm";

// GET /api/collections - получить все коллекции пользователя
export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session || !session.userId) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        const userCollections = await db.query.collections.findMany({
            where: eq(collections.userId, session.userId),
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
        const session = await getSession();

        if (!session || !session.userId) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

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
                userId: session.userId,
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

export async function PATCH(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session || !session.userId) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        const body = await request.json();
        const {id, name, description} = body;

        await db.update(collections).set({name, description}).where(eq(collections.id, id));
        return NextResponse.json({message: "Collection updated successfully"});
    } catch (error) {
        console.error("Error updating collection:", error);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session || !session.userId) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }
        const body = await request.json();
        const {id} = body;

        await db.delete(collections).where(eq(collections.id, id));
        return NextResponse.json({message: "Collection deleted successfully"});
    } catch (error) {
        console.error("Error deleting collection:", error);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        );
    }
}
