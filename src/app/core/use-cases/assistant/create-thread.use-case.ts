import { environment } from "environments/environment";

export const createThreadUseCase = async() => {

    try {
        const resp = await fetch(
            `${environment.assistantApi}/create-thread`, { method: 'POST'});

        if (!resp.ok) {
            throw new Error('No se pudo crear el hilo');
        }

        // we are going to return the id from response
        const data = await resp.json();
        return data.id as string;        
    } catch (error) {
        console.log(error);
        throw new Error('No se pudo crear el hilo');
    }

}