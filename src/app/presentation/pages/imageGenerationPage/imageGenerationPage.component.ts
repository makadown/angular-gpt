import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from '../../../presentation/services/openai.service';

@Component({
  selector: 'app-image-generation-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './imageGenerationPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageGenerationPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public OpenAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
      this.isLoading.set(true);
      this.messages.update((prev) => [
        ...prev, 
        { 
            text: prompt, isGpt: false 
        }
      ]);

      this.OpenAiService.imageGeneration(prompt).subscribe(
        resp => {
          if (!resp) return;

          this.isLoading.set(false);
          this.messages.update((prev) => [
            ...prev,
            {
              text: resp.alt,
              isGpt: true,
              imageInfo: resp!
            }
          ])
        }
      )
  }
 }
