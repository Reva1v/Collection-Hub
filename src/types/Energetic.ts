export interface Energetic {
    id: string;
    description: string;
    image: string;
    collect: 'unknown' | 'collected' | 'will-not-collect';
    type: string;
}
