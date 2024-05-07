import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxSelectComponent, TextMessageBoxEvent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from '../../../presentation/services/openai.service';

@Component({
  selector: 'app-text-to-audio-page',
  standalone: true,
  imports: [    
    CommonModule, ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent {
  public voices = signal([
    { id: 'allow', text: 'Alloy' },
    { id: 'echo', text: 'Echo' },
    { id: 'fable', text: 'Fable' },
    { id: 'onyx', text: 'Onyx' },
    { id: 'nova', text: 'Nova' },
    { id: 'shimmer', text: 'Shimmer' },
  ]);

  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  handleMessage({prompt, selectedOption}: TextMessageBoxEvent) {
      const message = `${selectedOption}: ${prompt}`;
      this.isLoading.set(true);
      this.messages.update((prev) => [
        ...prev, 
        { 
            text: message,
            isGpt: false 
        }
      ]);
      this.openAiService.textToAudio(prompt, selectedOption).subscribe(
        resp => {
          this.isLoading.set(false);
          this.messages.update((prev) => [
            ...prev,
            {
              text: resp.message,
              isGpt: true,
              audioUrl: resp.audioUrl
            }
          ])
        }
      )
  }

}
