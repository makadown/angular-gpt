import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface TextMessageEvent {
  prompt?: string | null;
  file: File;
}

@Component({
  selector: 'app-text-message-box-file',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './textMessageBoxFile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxFileComponent { 
  @Input() placeholder = '';
  @Input() disableCorrections = false;

  @Output() onMessage = new EventEmitter<TextMessageEvent>();

  public fb = inject(FormBuilder);
  public form = this.fb.group({
    prompt: [],
    file: [null, Validators.required]
  });
  public file: File|undefined;

  handleSelectedFile(event: any) {
    const file = event.target.files?.[0];
    console.log(file);
    if (file === undefined) {
      return;
    }    
    this.file = file;
    this.form.controls.file.setValue(file);
    
  }

  handleSubmit() {
    if (this.form.valid) {      
      const {prompt, file} = this.form.value;// esto es igual a const prompt = this.form.value.prompt;
      this.onMessage.emit({prompt, file: file!});
      this.form.reset();
    }
  }
}
