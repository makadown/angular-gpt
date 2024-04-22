export interface Message{
    text: string;
    /**
     * Indicates if the message is from the user or the AI
     */
    isGpt: boolean;
}