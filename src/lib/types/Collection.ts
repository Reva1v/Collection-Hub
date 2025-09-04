import {Item} from "@/lib/types/Item.ts";

export interface Collection {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    createdAt: Date | null;
}[]

export interface CollectionWithItems extends Collection {
    items: Item[];
}
