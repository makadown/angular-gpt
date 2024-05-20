import { Injectable } from '@angular/core';
import { Message } from '@interfaces/index';
import { audioToTextUseCase,
        createThreadUseCase,
        imageGenerationUseCase,
        imageVariationUseCase,
        orthographyUseCase,
        prosConsStreamUseCase,
        prosConsUseCase,
        textToAudioUseCase,
        translateUseCase,
        userQuestionThreadUseCase 
      } from '@use-cases/index';
import { Observable, from, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAiService {
  
  private THREADID = 'threadId';

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

  // create thread and store its id in localstorage
  createThread(): Observable<string> {
    if (localStorage.getItem(this.THREADID)) {
      return of(localStorage.getItem(this.THREADID)!);
    }

    return from( createThreadUseCase()).pipe(
                // store thread id in localstorage
                // and return it
                tap((threadId) => localStorage.setItem(this.THREADID, threadId))
              );
  }

  postQuestion(threadId: string, question: string) {
    return from( userQuestionThreadUseCase(threadId, question));
  }

  /**
   * Save the conversation in localstorage
   * @param threadId 
   * @param replies 
   */
  saveConversation(threadId: string, replies: Message[]) {
    localStorage.setItem(threadId+'-replies', JSON.stringify(replies));
  }

  /**
   * Load conversations from localstorage
   */
  loadConversation(threadId: string) {
    const replies = localStorage.getItem(threadId+'-replies');
    if (replies) {
      return JSON.parse(replies);
    }
    return [];
  }

}
