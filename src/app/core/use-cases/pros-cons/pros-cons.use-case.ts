
import { ProsConsResponse } from "@interfaces/prosCons.response";
import { environment } from "environments/environment.development";

export const prosConsUseCase = async(prompt:string) => {
    try{
        const response = await fetch(`${environment.backendApi}/pro-cons-discusser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({prompt})
        });

        if(!response.ok){ throw new Error('No se pudo procesar la comparación'); }

        const data = await response.json() as ProsConsResponse;
        return {
            ok: true,
            ...data
        }
    }
    catch(e){
        console.log(e);
        return {
            ok: false,
            role: 'assistant',
            content: 'Lo siento, no se pudo procesar la comparación'
        }
    }
}