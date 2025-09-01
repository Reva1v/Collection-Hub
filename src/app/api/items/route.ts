import { NextResponse } from "next/server";
import { items, collections } from "@/lib/db/schema";
import { db } from "@/lib/db/db";
import { randomUUID } from "crypto";
import { z, ZodError } from "zod";
import { eq, and } from "drizzle-orm";
import {getCurrentUser} from "@/lib/auth/session.ts";

// Схема для валидации POST запроса
const ItemSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(3, { message: "Description is required" }),
    image: z.string().url({ message: "Image must be a valid URL" }),
    collectStatus: z.enum(["unknown", "collected", "will-not-collect"]).optional(),
    type: z.string().min(1, { message: "Type is required" }),
    collectionId: z.string().uuid("A valid collection ID is required"),
});

// GET /items?type=xxx
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");

        let result;
        if (type && type !== "all") {
            result = await db.select().from(items).where(eq(items.type, type));
        } else {
            result = await db.select().from(items);
        }

        return NextResponse.json(result);
    } catch (e) {
        console.error("GET /items error:", e);
        return NextResponse.json({ error: "Failed to load items" }, { status: 500 });
    }
}

// POST /items
export async function POST(req: Request) {
    try {
        // Получаем userId текущего пользователя
        const userId = (await getCurrentUser())!;

        const body = await req.json();
        const parsed = ItemSchema.parse(body);

        // Проверяем, что коллекция принадлежит текущему пользователю
        const collectionExists = await db
            .select()
            .from(collections)
            .where(and(eq(collections.id, parsed.collectionId), eq(collections.userId, userId)))
            .limit(1);

        if (collectionExists.length === 0) {
            return NextResponse.json({ error: "Collection not found or does not belong to you" }, { status: 403 });
        }

        await db.insert(items).values({
            id: randomUUID(),
            name: parsed.name,
            description: parsed.description,
            image: parsed.image,
            type: parsed.type,
            collectStatus: parsed.collectStatus ?? "unknown",
            collectionId: parsed.collectionId,
        });

        return NextResponse.json({ message: "Item added successfully" }, { status: 201 });
    } catch (e) {
        if (e instanceof ZodError) {
            return NextResponse.json(
                {
                    error: e.issues.map((issue) => ({
                        path: issue.path.join("."),
                        message: issue.message,
                    })),
                },
                { status: 400 }
            );
        }
        console.error("POST /items error:", e);
        return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
    }
}
