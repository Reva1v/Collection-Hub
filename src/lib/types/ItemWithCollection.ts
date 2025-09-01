import {Item} from "@/lib/types/Item";
import {Collection} from "@/lib/types/Collection";

export interface ItemWithCollection extends Item {
    collection: Collection;
}
