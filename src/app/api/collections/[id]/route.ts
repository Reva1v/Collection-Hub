// app/api/collections/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/auth/session-db";
import { db } from "@/db/db";
import { collections } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// PATCH /api/collections/[id] - обновить коллекцию
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();

        if (!session || !session.userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, description } = body;

        // Проверяем, что коллекция принадлежит пользователю
        const collection = await db.query.collections.findFirst({
            where: and(
                eq(collections.id, params.id),
                eq(collections.userId, session.userId)
            ),
        });

        if (!collection) {
            return NextResponse.json(
                { error: "Collection not found" },
                { status: 404 }
            );
        }

        const updates: Partial<typeof collections.$inferInsert> = {};
        if (name !== undefined) updates.name = name.trim();
        if (description !== undefined) updates.description = description?.trim() || null;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(collection);
        }

        const [updatedCollection] = await db
            .update(collections)
            .set(updates)
            .where(eq(collections.id, params.id))
            .returning();

        return NextResponse.json(updatedCollection);
    } catch (error) {
        console.error("Error updating collection:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE /api/collections/[id] - удалить коллекцию
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();

        if (!session || !session.userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Проверяем, что коллекция принадлежит пользователю
        const collection = await db.query.collections.findFirst({
            where: and(
                eq(collections.id, params.id),
                eq(collections.userId, session.userId)
            ),
        });

        if (!collection) {
            return NextResponse.json(
                { error: "Collection not found" },
                { status: 404 }
            );
        }

        // Удаляем коллекцию (элементы удалятся автоматически из-за CASCADE)
        await db.delete(collections).where(eq(collections.id, params.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting collection:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
