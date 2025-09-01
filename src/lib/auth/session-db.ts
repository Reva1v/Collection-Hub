// import 'server-only';
//
// import {SignJWT, jwtVerify} from 'jose';
// import {cookies} from 'next/headers';
// import type {SessionPayload} from '@/app/auth/definitions.ts';
// import {sessions} from '@/db/schema';
// import {db} from '@/db/db.ts';
// import {redirect} from "next/navigation";
// import {eq} from "drizzle-orm";
//
// const secretKey = process.env.SECRET;
// const key = new TextEncoder().encode(secretKey);
//
// export interface SessionData {
//     userId: string;
//     token: string;
//     expiresAt: Date;
// }
//
// export async function encrypt(payload: SessionPayload) {
//     return new SignJWT(payload)
//         .setProtectedHeader({alg: 'HS256'})
//         .setIssuedAt()
//         .setExpirationTime('1hr')
//         .sign(key);
// }
//
// export async function decrypt(session: string | undefined = '') {
//     try {
//         const {payload} = await jwtVerify(session, key, {
//             algorithms: ['HS256'],
//         });
//         return payload;
//     } catch (error) {
//         console.log('Failed to verify session');
//         return null;
//     }
// }
//
// export async function createSession(userId: string) {
//     const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//     const token = await encrypt({userId, expiresAt});
//
//     // 1. Create a session in the database
//     const data = await db
//         .insert(sessions)
//         .values({
//             userId,
//             expiresAt,
//             token,
//         })
//         // Return the session ID
//         .returning({id: sessions.id});
//
//     const sessionId = data[0].id;
//
//     // 2. Encrypt the session ID
//     const session = await encrypt({userId, expiresAt});
//
//     // 3. Store the session in cookies for optimistic auth checks
//     (await cookies()).set('session', session, {
//         httpOnly: true,
//         secure: true,
//         expires: expiresAt,
//         sameSite: 'lax',
//         path: '/',
//     });
//
//     //МБ ПОМЕНЯТЬ НА ЧТО-ТО ДРУГОЕ
//     redirect('/');
// }
//
// export async function getSession(): Promise<SessionData | null> {
//     try {
//         const cookieStore = await cookies();
//         const sessionToken = cookieStore.get('session')?.value;
//
//         if (!sessionToken) {
//             return null;
//         }
//
//         // Ищем активную сессию в БД
//         const session = await db.query.sessions.findFirst({
//             where: eq(sessions.token, sessionToken),
//         });
//
//         if (!session) {
//             return null;
//         }
//
//         // Проверяем, не истекла ли сессия
//         if (session.expiresAt < new Date()) {
//             // Удаляем истекшую сессию
//             await db.delete(sessions).where(eq(sessions.id, session.id));
//             return null;
//         }
//
//         return {
//             userId: session.userId,
//             token: session.token,
//             expiresAt: session.expiresAt,
//         };
//     } catch (error) {
//         console.error('Error getting session:', error);
//         return null;
//     }
// }
