import { OrthographyResponse } from "@interfaces/orthography.response";
import { environment } from "environments/environment";

export const orthographyUseCase = async(prompt:string) => {
    try{
        const response = await fetch(`${environment.backendApi}/orthography-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({prompt})
        });

        if(!response.ok){ throw new Error('No se pudo procesar la ortografía'); }

        const data = await response.json() as OrthographyResponse;
        return {
            ok: true,
            ...data
        }
    }
    catch(e){
        console.log(e);
        return {
            ok: false,
            userScore: 0,
            errors: [],
            message: 'No se pudo procesar la ortografía'
        }
    }
}