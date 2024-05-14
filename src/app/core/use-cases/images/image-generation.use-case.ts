
import { ImageGenerationResponse } from "@interfaces/image-generation.response";
import { environment } from "environments/environment";

type GeneratedImage = Image | null;

interface Image {
    url: string;
    alt: string;
}

export const imageGenerationUseCase = async(
        prompt:string,
        originalImage?:string,
        maskImage?:string
    ):Promise<GeneratedImage> => {
    try{
        const response = await fetch(`${environment.backendApi}/image-generation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({prompt, originalImage, maskImage})
        });

        if(!response.ok){ throw new Error('No se pudo generar imagen'); }

        const data = (await response.json()) as ImageGenerationResponse; 
        return {
            url: data.url,
            alt: data.revised_prompt
        };
    }
    catch(e){
        console.log(e);
        return null;
    }
}