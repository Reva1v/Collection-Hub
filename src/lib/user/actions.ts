'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '../db/db.ts';
import { users } from '@/lib/db/schema'; // схема таблицы users
import { eq, or } from 'drizzle-orm';
import { verifySession } from '@/lib/auth/session';
import { hash } from 'bcrypt';
import type { User } from '../types/User'; // тип пользователя

export async function getUsers(): Promise<User[]> {
    try {
        // Проверяем сессию (может быть нужна проверка на админские права)
        await verifySession();

        const allUsers = await db
            .select({
                id: users.id,
                username: users.username,
                email: users.email,
                createdAt: users.createdAt,
            })
            .from(users)
            .orderBy(users.createdAt);

        return allUsers;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return [];
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const { userId } = await verifySession();

        const [user] = await db
            .select({
                id: users.id,
                username: users.username,
                email: users.email,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        return user || null;
    } catch (error) {
        console.error('Failed to fetch current user:', error);
        return null;
    }
}

export async function getUserById(userId: string): Promise<User | null> {
    try {
        await verifySession(); // Проверка авторизации

        const [user] = await db
            .select({
                id: users.id,
                username: users.username,
                email: users.email,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        return user || null;
    } catch (error) {
        console.error('Failed to fetch user by id:', error);
        return null;
    }
}

// export async function createUser(prevState: unknown, formData: FormData) {
//     try {
//         const username = formData.get('username') as string;
//         const email = formData.get('email') as string;
//         const password = formData.get('password') as string;
//
//         if (!username?.trim()) {
//             return { error: 'Username is required' };
//         }
//
//         if (!email?.trim()) {
//             return { error: 'Email is required' };
//         }
//
//         if (!password || password.length < 6) {
//             return { error: 'Password must be at least 6 characters long' };
//         }
//
//         // Проверяем уникальность username и email
//         const existingUser = await db
//             .select()
//             .from(users)
//             .where(or(
//                 eq(users.username, username.trim()),
//                 eq(users.email, email.trim())
//             ))
//             .limit(1);
//
//         if (existingUser.length > 0) {
//             return { error: 'Username or email already exists' };
//         }
//
//         // Хешируем пароль
//         const passwordHash = await hash(password, 12);
//
//         const [newUser] = await db
//             .insert(users)
//             .values({
//                 username: username.trim(),
//                 email: email.trim(),
//                 passwordHash,
//                 createdAt: new Date(),
//             })
//             .returning({
//                 id: users.id,
//                 username: users.username,
//                 email: users.email,
//                 createdAt: users.createdAt,
//             });
//
//         revalidatePath('/admin/users'); // или другой путь где отображаются пользователи
//         return { success: true, user: newUser };
//     } catch (error) {
//         console.error('Failed to create user:', error);
//         return { error: 'Failed to create user' };
//     }
// }

export async function updateUser(userId: string, formData: FormData) {
    try {
        const { userId: currentUserId } = await verifySession();

        // Можем обновлять только свой профиль или нужны админские права
        if (currentUserId !== userId) {
            // Здесь можно добавить проверку на админские права
            return { error: 'Access denied' };
        }

        const username = formData.get('username') as string;
        const email = formData.get('email') as string;

        if (!username?.trim()) {
            return { error: 'Username is required' };
        }

        if (!email?.trim()) {
            return { error: 'Email is required' };
        }

        // Проверяем уникальность username и email (исключая текущего пользователя)
        const existingUser = await db
            .select()
            .from(users)
            .where(or(
                eq(users.username, username.trim()),
                eq(users.email, email.trim())
            ))
            .limit(1);

        if (existingUser.length > 0 && existingUser[0].id !== userId) {
            return { error: 'Username or email already exists' };
        }

        const [updatedUser] = await db
            .update(users)
            .set({
                username: username.trim(),
                email: email.trim(),
            })
            .where(eq(users.id, userId))
            .returning({
                id: users.id,
                username: users.username,
                email: users.email,
                createdAt: users.createdAt,
            });

        if (!updatedUser) {
            return { error: 'User not found' };
        }

        revalidatePath('/profile');
        revalidatePath('/admin/users');
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error('Failed to update user:', error);
        return { error: 'Failed to update user' };
    }
}

export async function updateUserPassword(userId: string, formData: FormData) {
    try {
        const { userId: currentUserId } = await verifySession();

        if (currentUserId !== userId) {
            return { error: 'Access denied' };
        }

        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return { error: 'All password fields are required' };
        }

        if (newPassword !== confirmPassword) {
            return { error: 'New passwords do not match' };
        }

        if (newPassword.length < 6) {
            return { error: 'New password must be at least 6 characters long' };
        }

        // Здесь должна быть проверка текущего пароля
        // const isValidPassword = await verify(currentPassword, user.passwordHash);
        // if (!isValidPassword) {
        //     return { error: 'Current password is incorrect' };
        // }

        const passwordHash = await hash(newPassword, 12);

        await db
            .update(users)
            .set({ passwordHash })
            .where(eq(users.id, userId));

        return { success: true, message: 'Password updated successfully' };
    } catch (error) {
        console.error('Failed to update password:', error);
        return { error: 'Failed to update password' };
    }
}

export async function deleteUser(userId: string) {
    try {
        const { userId: currentUserId } = await verifySession();

        // Можем удалять только свой аккаунт или нужны админские права
        if (currentUserId !== userId) {
            // Здесь можно добавить проверку на админские права
            return { error: 'Access denied' };
        }

        const [deletedUser] = await db
            .delete(users)
            .where(eq(users.id, userId))
            .returning({
                id: users.id,
                username: users.username,
                email: users.email,
            });

        if (!deletedUser) {
            return { error: 'User not found' };
        }

        revalidatePath('/admin/users');
        redirect('/'); // Перенаправляем на главную после удаления аккаунта
    } catch (error) {
        console.error('Failed to delete user:', error);
        return { error: 'Failed to delete user' };
    }
}
