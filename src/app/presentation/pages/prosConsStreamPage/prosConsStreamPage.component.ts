import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from '../../../presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-stream-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);
  public abortController = new AbortController();

  async handleMessage(prompt: string) {
    this.abortController.abort();
    this.abortController = new AbortController();

    this.messages.update((prev) => [
      ...prev,
      {
        text: prompt,
        isGpt: false
      },
      {
        text: 'Cargando...',
        isGpt: true
      }
    ]);

    

    this.isLoading.set(true);
    const stream = this.openAiService.checkProsConsStream(prompt, this.abortController.signal);

    for await (const text of stream) {
      this.handleStreamResponse(text);
    }
    this.isLoading.set(false);

  }

  handleStreamResponse(message:string) {
    this.messages().pop(); // remove loading message
    const messages = this.messages();
    this.messages.set([...messages, { text: message, isGpt: true }]);    
  }
}
