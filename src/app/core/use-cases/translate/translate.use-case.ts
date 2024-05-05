
import { TranslateResponse } from "@interfaces/translate.response";
import { environment } from "environments/environment";

export const translateUseCase = async(prompt:string, lang:string) => {
    try{
        const response = await fetch(`${environment.backendApi}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({prompt, lang})
        });

        if(!response.ok){ throw new Error('No se pudo procesar la traducción'); }

        const data = await response.json() as TranslateResponse;
        return {
            ok: true,
            ...data
        }
    }
    catch(e){
        console.log(e);
        return {
            ok: false,
            message: 'No se pudo procesar la traducción'
        }
    }
}