export type CollectStatus = "unknown" | "collected" | "will-not-collect" | null;

export interface Item {
    id: string;
    collectionId: string;
    name: string;
    description: string;
    image: string | null;
    type: string | null;
    collectStatus: "unknown" | "collected" | "will-not-collect" | null;
    createdAt: Date | null;
}
