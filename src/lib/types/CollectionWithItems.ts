import {Collection} from "@/lib/types/Collection";
import {Item} from "@/lib/types/Item.ts";

export interface CollectionWithItems extends Collection {
    items: Item[];
}
