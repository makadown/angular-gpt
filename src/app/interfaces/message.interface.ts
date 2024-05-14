export interface Message{
    text: string;
    /**
     * Indicates if the message is from the user or the AI
     */
    isGpt: boolean;
    info?: {
        userScore: number;
        errors: string[];
        message: string;
    },
    audioUrl?: string;
    imageInfo?: {
        url: string;
        alt: string;
    }
}
