import 'server-only';
import {db} from '@/db/db';
import {eq} from 'drizzle-orm';
import {cache} from 'react';
import {users} from '@/db/schema';
import {verifySession} from '@/app/auth/session';

// In definitions.ts
// export interface SessionPayload {
//     userId: string;  // Changed from string | number to just string
//     expiresAt: Date;
// }

export const getUser = cache(async () => {
    const session = await verifySession();
    if (!session) return null;

    try {
        const data = await db.query.users.findMany({
            where: eq(users.id, String(session.userId)),

            // Explicitly return the columns you need rather than the whole user object
            columns: {
                id: true,
                username: true,
                email: true,
            },
        });

        return data[0] || null;
    } catch (error) {
        console.log('Failed to fetch user');
        return null;
    }
});
