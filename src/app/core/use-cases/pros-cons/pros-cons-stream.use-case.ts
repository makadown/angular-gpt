import { environment } from "environments/environment";


export async function* prosConsStreamUseCase(prompt:string, abortSignal:AbortSignal) {
    try{
        const response = await fetch(`${environment.backendApi}/pro-cons-discusser-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({prompt}),
            signal: abortSignal
        });

        if(!response.ok){ throw new Error('No se pudo procesar la comparación'); }

        const reader = response.body?.getReader();
        if (!reader) {
            console.log('No se pudo generar el reader');
            throw new Error('No se pudo procesar la comparación');
        }
        const decoder = new TextDecoder();
        let text = '';
        while(true) {
            const { value, done } = await reader.read();
            
            if (done) break;

            const decoderChunk = decoder.decode(value, { stream: true });
            text += decoderChunk;
            yield text;
        }
        return text;
    }
    catch(e){
        return null;
    }
}