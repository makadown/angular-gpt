import { AudioToTextResponse } from "@interfaces/index";
import { environment } from "environments/environment";

export const audioToTextUseCase = async (file: File, prompt?: string) => {

    try {
        const formdata = new FormData();
        formdata.append("file", file);
        if (prompt && prompt.length > 0) {
            formdata.append("prompt", prompt);
        }
    
        const requestOptions = {
            method: "POST",
            body: formdata
        };
    
        const resp = await fetch(`${environment.backendApi}/audio-to-text`, requestOptions);
        const data = (await resp.json()) as AudioToTextResponse;

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }    

}
