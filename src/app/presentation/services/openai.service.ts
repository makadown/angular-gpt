import { Injectable } from '@angular/core';
import { orthographyUseCase } from '@use-cases/orthography';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAiService {

  constructor() { }

  checkOrthography(prompt: string) {
    return from( orthographyUseCase(prompt));
  }

}
