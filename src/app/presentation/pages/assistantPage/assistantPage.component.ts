import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMessageEvent, TextMessageBoxEvent, GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message, QuestionResponse } from '@interfaces/index';
import { OpenAiService } from '../../../presentation/services/openai.service';

@Component({
  selector: 'app-assistant-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent, 
  ],
  templateUrl: './assistantPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AssistantPageComponent implements OnInit {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);
  public threadId = signal<string>('');

  ngOnInit(): void {
    this.openAiService.createThread().subscribe(id => {
        this.threadId.set(id);
        // load conversation from localstorage if there is one
        const messages = this.openAiService.loadConversation(id);
        this.messages.set(messages);
    });
  }

  handleMessage(question: string) {
      this.isLoading.set(true);

      this.messages.update((prev) => [
        ...prev, 
        { 
            text: question, isGpt: false 
        }
      ]);

      this.openAiService.postQuestion(this.threadId(), question).subscribe( 
        (replies: QuestionResponse[]) => {          
          this.isLoading.set(false);
          if (!replies) return;
          if (replies.length === 0) return;
          
          // take only the last reply 
          const lastReply = replies[replies.length - 1];
          this.messages.update((prev) => [
            ...prev,
            {
              text: lastReply.content[0],
              isGpt: true
            }
          ]);

          // save the whole conversation in local storage
          this.openAiService.saveConversation(this.threadId(), this.messages()!);
          
      });
  }
 }
