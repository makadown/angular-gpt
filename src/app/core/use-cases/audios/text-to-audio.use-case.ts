
import { environment } from "environments/environment";

export const textToAudioUseCase = async(prompt:string, voice:string) => {
    try{
        const response = await fetch(`${environment.backendApi}/text-to-audio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({prompt, voice})
        });

        if(!response.ok){ throw new Error('No se pudo generar el audio'); }

        const audioFile = await response.blob();
        const audioUrl = URL.createObjectURL(audioFile);
        return {
            ok: true,
            message: prompt,
            audioUrl: audioUrl
        }
    }
    catch(e){
        console.log(e);
        return {
            ok: false,
            message: 'No se pudo generar el audio',
            audioUrl: '',
        }
    }
}