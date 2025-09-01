'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../db/db.ts';
import { items, collections } from '@/lib/db/schema';
import {eq, and, ne, isNotNull} from 'drizzle-orm';
import { verifySession } from '@/lib/auth/session';
import type { Item, CollectStatus } from '../types/Item';

export async function getItems(collectionId?: string): Promise<Item[]> {
    try {
        const { userId } = await verifySession();

        const conditions = collectionId
            ? and(eq(collections.userId, userId), eq(items.collectionId, collectionId))
            : eq(collections.userId, userId);

        const result = await db
            .select({
                id: items.id,
                collectionId: items.collectionId,
                name: items.name,
                description: items.description,
                image: items.image,
                type: items.type,
                collectStatus: items.collectStatus,
                createdAt: items.createdAt,
            })
            .from(items)
            .innerJoin(collections, eq(items.collectionId, collections.id))
            .where(conditions)
            .orderBy(items.createdAt);

        return result;
    } catch (error) {
        console.error('Failed to fetch items:', error);
        return [];
    }
}


export async function createItem(formData: FormData) {
    try {
        const { userId } = await verifySession();

        const collectionId = formData.get('collectionId') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const image = formData.get('image') as string;
        const type = formData.get('type') as string;
        const collectStatus = (formData.get('collectStatus') as CollectStatus) || 'unknown';

        if (!collectionId || !name?.trim() || !description?.trim()) {
            return { error: 'Collection ID, name and description are required' };
        }

        // Проверяем, что коллекция принадлежит пользователю
        const collection = await db
            .select()
            .from(collections)
            .where(and(
                eq(collections.id, collectionId),
                eq(collections.userId, userId)
            ))
            .limit(1);

        if (!collection.length) {
            return { error: 'Collection not found or access denied' };
        }

        const [newItem] = await db
            .insert(items)
            .values({
                collectionId,
                name: name.trim(),
                description: description.trim(),
                image: image?.trim() || null,
                type: type?.trim() || null,
                collectStatus,
                createdAt: new Date(),
            })
            .returning();

        revalidatePath('/collections');
        revalidatePath(`/collections/${collectionId}`);
        return { success: true, item: newItem };
    } catch (error) {
        console.error('Failed to create item:', error);
        return { error: 'Failed to create item' };
    }
}

export async function updateItem(itemId: string, formData: FormData) {
    try {
        const { userId } = await verifySession();

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const image = formData.get('image') as string;
        const type = formData.get('type') as string;
        const collectStatus = formData.get('collectStatus') as CollectStatus;

        // Создаем объект обновления только с переданными полями
        const updates: Partial<typeof items.$inferInsert> = {};

        if (name !== null) updates.name = name?.trim();
        if (description !== null) updates.description = description?.trim();
        if (image !== null) updates.image = image?.trim() || null;
        if (type !== null) updates.type = type?.trim() || null;
        if (collectStatus !== null) updates.collectStatus = collectStatus;

        // Обновляем элемент только если он принадлежит пользователю (через join)
        const [updatedItem] = await db
            .update(items)
            .set(updates)
            .from(collections)
            .where(and(
                eq(items.id, itemId),
                eq(items.collectionId, collections.id),
                eq(collections.userId, userId)
            ))
            .returning();

        if (!updatedItem) {
            return { error: 'Item not found or access denied' };
        }

        revalidatePath('/collections');
        revalidatePath(`/collections/${updatedItem.collectionId}`);
        return { success: true, item: updatedItem };
    } catch (error) {
        console.error('Failed to update item:', error);
        return { error: 'Failed to update item' };
    }
}

export async function updateCollectStatus(itemId: string, status: CollectStatus) {
    try {
        const { userId } = await verifySession();

        const [updatedItem] = await db
            .update(items)
            .set({ collectStatus: status })
            .from(collections)
            .where(and(
                eq(items.id, itemId),
                eq(items.collectionId, collections.id),
                eq(collections.userId, userId)
            ))
            .returning();

        if (!updatedItem) {
            return { error: 'Item not found or access denied' };
        }

        revalidatePath('/collections');
        revalidatePath(`/collections/${updatedItem.collectionId}`);
        return { success: true, item: updatedItem };
    } catch (error) {
        console.error('Failed to update collect status:', error);
        return { error: 'Failed to update collect status' };
    }
}

export async function deleteItem(itemId: string) {
    try {
        const { userId } = await verifySession();

        // Проверка: принадлежит ли item пользователю
        const [item] = await db
            .select({
                id: items.id,
                collectionId: items.collectionId,
            })
            .from(items)
            .innerJoin(collections, eq(items.collectionId, collections.id))
            .where(and(eq(items.id, itemId), eq(collections.userId, userId)));

        if (!item) {
            return { error: 'Item not found or access denied' };
        }

        // Удаляем только после проверки
        const [deletedItem] = await db
            .delete(items)
            .where(eq(items.id, itemId))
            .returning();

        revalidatePath('/collections');
        revalidatePath(`/collections/${item.collectionId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete item:', error);
        return { error: 'Failed to delete item' };
    }
}


export async function getUniqueTypes(collectionId?: string): Promise<string[]> {
    try {
        const { userId } = await verifySession();

        const conditions = collectionId
            ? and(
                eq(collections.userId, userId),
                eq(items.collectionId, collectionId),
                isNotNull(items.type),
                ne(items.type, '')
            )
            : and(
                eq(collections.userId, userId),
                isNotNull(items.type),
                ne(items.type, '')
            );

        const result = await db
            .selectDistinct({ type: items.type })
            .from(items)
            .innerJoin(collections, eq(items.collectionId, collections.id))
            .where(conditions);

        return result
            .map(row => row.type)
            .filter((t): t is string => t !== null && t !== '');
    } catch (error) {
        console.error('Failed to fetch unique types:', error);
        return [];
    }
}

