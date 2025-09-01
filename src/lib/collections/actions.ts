'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '../db/db.ts';
import { collections, items } from '@/lib/db/schema'; // схемы таблиц
import { eq, and } from 'drizzle-orm';
import { verifySession } from '@/lib/auth/session';
import type { Collection } from '../types/Collection'; // перенесем типы в отдельный файл

export async function getCollections(): Promise<Collection[]> {
    try {
        const { userId } = await verifySession();
        // const userIdStr = String(userId);

        const userCollections = await db
            .select()
            .from(collections)
            .where(eq(collections.userId, userId))
            .orderBy(collections.createdAt);

        return userCollections;
    } catch (error) {
        console.error('Failed to fetch collections:', error);
        return [];
    }
}

export async function createCollection(prevState: unknown, formData: FormData) {
    try {
        const { userId } = await verifySession();

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;

        if (!name?.trim()) {
            return { error: 'Collection name is required' };
        }

        const [newCollection] = await db
            .insert(collections)
            .values({
                userId,
                name: name.trim(),
                description: description?.trim() || null,
                createdAt: new Date(),
            })
            .returning();

        revalidatePath('/collections');
        return { success: true, collection: newCollection };
    } catch (error) {
        console.error('Failed to create collection:', error);
        return { error: 'Failed to create collection' };
    }
}

export async function updateCollection(collectionId: string, formData: FormData) {
    try {
        const { userId } = await verifySession();

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;

        if (!name?.trim()) {
            return { error: 'Collection name is required' };
        }

        const [updatedCollection] = await db
            .update(collections)
            .set({
                name: name.trim(),
                description: description?.trim() || null,
            })
            .where(and(
                eq(collections.id, collectionId),
                eq(collections.userId, userId)
            ))
            .returning();

        if (!updatedCollection) {
            return { error: 'Collection not found or access denied' };
        }

        revalidatePath('/collections');
        revalidatePath(`/collections/${collectionId}`);
        return { success: true, collection: updatedCollection };
    } catch (error) {
        console.error('Failed to update collection:', error);
        return { error: 'Failed to update collection' };
    }
}

export async function deleteCollection(collectionId: string) {
    try {
        const { userId } = await verifySession();

        // Сначала удаляем все связанные элементы
        await db
            .delete(items)
            .where(and(
                eq(items.collectionId, collectionId),
                // Дополнительная проверка через userId можно сделать через join
            ));

        // Затем удаляем коллекцию
        const [deletedCollection] = await db
            .delete(collections)
            .where(and(
                eq(collections.id, collectionId),
                eq(collections.userId, userId)
            ))
            .returning();

        if (!deletedCollection) {
            return { error: 'Collection not found or access denied' };
        }

        revalidatePath('/collections');
        redirect('/collections');
    } catch (error) {
        console.error('Failed to delete collection:', error);
        return { error: 'Failed to delete collection' };
    }
}

export async function getCollectionWithItems(collectionId: string) {
    try {
        const { userId } = await verifySession();

        // Получаем коллекцию
        const collection = await db
            .select()
            .from(collections)
            .where(and(
                eq(collections.id, collectionId),
                eq(collections.userId, userId)
            ))
            .limit(1);

        if (!collection.length) {
            return null;
        }

        // Получаем элементы коллекции
        const collectionItems = await db
            .select()
            .from(items)
            .where(eq(items.collectionId, collectionId))
            .orderBy(items.createdAt);

        return {
            ...collection[0],
            items: collectionItems,
        };
    } catch (error) {
        console.error('Failed to fetch collection with items:', error);
        return null;
    }
}
