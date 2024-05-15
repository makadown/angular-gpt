import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { OpenAiService } from '../../../presentation/services/openai.service';
import { ReactiveFormsModule } from '@angular/forms';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, GtpMessageEditableImageComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';

@Component({
  selector: 'app-image-tunning-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    GtpMessageEditableImageComponent
  ],
  templateUrl: './imageTunningPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunningPageComponent {

  public messages = signal<Message[]>([
    // {
    //   text: 'TEST',
    //   isGpt: true,
    //   imageInfo: {
    //     url: 'http://localhost:3000/gpt/image-generation/1715797110451.png',
    //     alt: 'Imagen de prueba'
    //   }
    // }
  ]);
  public isLoading = signal(false);
  public OpenAiService = inject(OpenAiService);

  public originalImage = signal<string|undefined>(undefined);
  public maskImage = signal<string|undefined>(undefined);

  handleMessage(prompt: string) {
      this.isLoading.set(true);
      this.messages.update((prev) => [
        ...prev, 
        { 
            text: prompt, isGpt: false 
        }
      ]);

      this.OpenAiService.imageGeneration(prompt, this.originalImage(), this.maskImage()).subscribe(
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

  /**
   * 
   * @param newImage as base64 string
   * @param originalImage url of the original image
   */
  handleSelectedImage(newImage: string, originalImage: string) {
   // console.log('newImage', newImage, 'originalImage', originalImage);
      this.maskImage.set(newImage);
      this.originalImage.set(originalImage);
      
  } 

  generateVariation() {
    const prompt = 'Genera variacion de la imagen';
    this.isLoading.set(true);
      this.messages.update((prev) => [
        ...prev, 
        { 
            text: prompt, isGpt: false 
        }
      ]);

      this.OpenAiService.imageVariation(this.originalImage()!).subscribe(
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
          ]);
          this.originalImage.set(resp!.url);
        }
      )
  }
}
