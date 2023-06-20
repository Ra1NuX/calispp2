export interface CaliProps {
    id?: string,
    text: string,
    date: number,
    isLiked?: boolean;
    timesVisited?: number,
    inactive?: boolean,
    assets?: string[],
    responses?: string[],
}  

export type WithId<T> = T & {
    id: string;
} 
