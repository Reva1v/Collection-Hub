// lib/actions/status-actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { updateCollectStatus } from '@/lib/items/actions';
import {CollectStatus} from "@/lib/types/Item.ts";

export async function toggleCollectStatus(itemId: string, currentStatus: CollectStatus) {
    const newStatus = currentStatus === 'collected' ? 'unknown' : 'collected';
    const result = await updateCollectStatus(itemId, newStatus);

    if (result.success) {
        revalidatePath('/collections');
        revalidatePath('/items');
    }

    return result;
}
