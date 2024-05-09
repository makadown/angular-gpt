import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageEvent, TextMessageBoxFileComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from '../../../presentation/services/openai.service';
import { AudioToTextResponse } from '../../../interfaces/audio-to-text.response';

@Component({
  selector: 'app-audio-to-text-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxFileComponent
  ],
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent { 
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  handleMessageWithFile({prompt, file}: TextMessageEvent) {
    const text = prompt ? file.name : 'Transcribe el audio de ' + file.name;
    this.isLoading.set(true);
    this.messages.update((prev) => [
      ...prev,
      {
        text,
        isGpt: false
      }
    ]);

      // use service to convert audio to text
      console.log(prompt, file);
      this.openAiService.audioToText(file, prompt!).subscribe((response) => {
          this.handleResponse(response);
      });
  }

  private handleResponse(resp: AudioToTextResponse | null) {
    this.isLoading.set(false);
    if (resp) {
      const texto = `
      ## Transcripción

      __Duración__: ${ Math.round(resp.duration) } segundos.

      ## El texto es:

      ${resp.text})
      `;
      const message: Message = {
        text: texto,
        isGpt: true
      }
      this.messages.update((messages) => [...messages, message]);

      for( const segment of resp.segments) {
        const segmentMessage = `
        __De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos.__
        ${segment.text}
        `;
        this.messages.update((messages) => [...messages, { text: segmentMessage, isGpt: true }]);
      }
    }
  }
}
