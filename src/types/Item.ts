export type CollectStatus = "unknown" | "collected" | "will-not-collect";

export interface Item {
    id: string;
    collectionId: string;
    name: string;
    description: string;
    image: string;
    type: string;
    collectStatus: CollectStatus;
    createdAt: string;
}
