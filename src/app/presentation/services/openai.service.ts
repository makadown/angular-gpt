import { Injectable } from '@angular/core';
import { audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase, orthographyUseCase, prosConsStreamUseCase, prosConsUseCase, textToAudioUseCase, translateUseCase } from '@use-cases/index';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAiService {

  constructor() { }

  checkOrthography(prompt: string) {
    return from( orthographyUseCase(prompt));
  }

  checkProsCons(prompt: string) {
    return from( prosConsUseCase(prompt));
  }

  checkProsConsStream(prompt: string, abortSignal: AbortSignal): AsyncGenerator<string, string | null, unknown> {
    return  prosConsStreamUseCase(prompt, abortSignal);
  }

  translate(prompt: string, lang: string) {
    return from( translateUseCase(prompt, lang));
  }

  textToAudio(prompt: string, voice: string) {
    return from( textToAudioUseCase(prompt, voice));
  }

  audioToText(file:File, prompt?:string) {
    return from( audioToTextUseCase(file, prompt));
  }

  imageGeneration( prompt:string,
              originalImage?:string,
            maskImage?:string
    ) {
    return from( imageGenerationUseCase(prompt, originalImage, maskImage));
  }

  imageVariation( baseImage:string ) {
    return from( imageVariationUseCase(baseImage));
  }

}
