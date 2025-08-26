import {NextResponse} from "next/server";
import {energetic} from "@/db/schema";
import {db} from "@/db/db.ts";
// import {Energetic} from "@/types/Energetic.ts";
import {randomUUID} from "crypto";
import {z, ZodError} from "zod";
import {eq} from "drizzle-orm";

const EnergeticSchema = z.object({
    description: z.string().min(3, {message: "Description is required"}),
    image: z.string().url({message: "Image must be a valid URL"}),
    collect: z.string().optional(),
    type: z.string().min(1, {message: "Type is required"}),
});

export async function GET(req: Request) {
    try {
        const {searchParams} = new URL(req.url);
        const type = searchParams.get("type");

        let items;
        if (type && type !== "all") {
            items = await db.select().from(energetic).where(eq(energetic.type, type));
        } else {
            items = await db.select().from(energetic);
        }

        return NextResponse.json(items);
    } catch (e) {
        console.error("GET /energetics error:", e);
        return NextResponse.json({error: "Failed to load energetics"}, {status: 500});
    }
}

export async function POST(req: Request) {
    try {
        const {searchParams} = new URL(req.url);

        const body = {
            description: searchParams.get("description") ?? undefined,
            image: searchParams.get("image") ?? undefined,
            collect: searchParams.get("collect") ?? undefined,
            type: searchParams.get("type") ?? undefined,
        };

        const parsed = EnergeticSchema.parse(body);

        await db.insert(energetic).values({
            id: randomUUID(),
            description: parsed.description,
            image: parsed.image,
            collect: (parsed.collect as 'unknown' | 'collected' | 'will-not-collect') ?? 'unknown',
            type: parsed.type,
        });
        return NextResponse.json({message: "Energetic added successfully"}, {status: 201});
    } catch (e) {
        if (e instanceof ZodError) {
            return NextResponse.json(
                {
                    error: e.issues.map((issue) => ({
                        path: issue.path.join("."),
                        message: issue.message,
                    })),
                },
                {status: 400}
            );
        }
        console.error("POST /energetic error:", e);
        return NextResponse.json({error: "Failed to add energetic"}, {status: 500});
    }
}
