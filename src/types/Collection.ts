import {Item} from "@/types/Item.ts";

export interface Collection {
    id: string;
    userId: string;
    name: string;
    description?: string;
    createdAt: string;
    items?: Item[];
}
