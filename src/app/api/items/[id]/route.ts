import { NextResponse } from "next/server";
import { items } from "@/lib/db/schema";
import { db } from "@/lib/db/db";
import { eq } from "drizzle-orm";

// PATCH /items/:id
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { collectStatus } = await req.json();

        if (!["unknown", "collected", "will-not-collect"].includes(collectStatus)) {
            return NextResponse.json({ error: "Invalid collectStatus" }, { status: 400 });
        }

        const [updated] = await db.update(items)
            .set({ collectStatus })
            .where(eq(items.id, params.id))
            .returning(); // вернёт обновлённый объект

        return NextResponse.json(updated); // 🔥 возвращаем весь item
    } catch (e) {
        console.error("PATCH /items/:id error:", e);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

