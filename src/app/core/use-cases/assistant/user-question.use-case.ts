import { QuestionResponse } from "@interfaces/question.response";
import { environment } from "environments/environment";

export const userQuestionThreadUseCase = async(threadId: string, question: string) => {

    try {
        const resp = await fetch(
            `${environment.assistantApi}/user-question`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ threadId, question })
            });

        if (!resp.ok) {
            throw new Error('No se pudo crear el hilo');
        }

        // we are going to return the array of QuestionResponse interface
        const replies = await resp.json() as QuestionResponse[];
        return replies;
    } catch (error) {
        console.log(error);
        throw new Error('No se pudo crear el hilo');
    }

}