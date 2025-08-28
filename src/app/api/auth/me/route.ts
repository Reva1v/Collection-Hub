// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/auth/session-db"; // функция для получения сессии
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        // Получаем сессию пользователя
        const session = await getSession();

        if (!session || !session.userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Получаем данные пользователя из БД
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.userId),
            columns: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                // passwordHash исключаем для безопасности
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error in /api/auth/me:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
