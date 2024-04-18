import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-text-message-box',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './textMessageBox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxComponent { 
  @Input() placeholder = '';
  @Input() disableCorrections = false;

  @Output() onMessage = new EventEmitter<string>();

  public fb = inject(FormBuilder);
  public form = this.fb.group({
    prompt: ['', Validators.required]
  });

  handleSubmit() {
    if (this.form.valid) {      
      const {prompt} = this.form.value;// esto es igual a const prompt = this.form.value.prompt;
      this.onMessage.emit(prompt??'');
      this.form.reset();
    }
  }
}
