import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-gtp-message-editable-image',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './gtpMessageEditableImage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GtpMessageEditableImageComponent implements AfterViewInit {
  
  @ViewChild('canvas') canvasElement?: ElementRef<HTMLCanvasElement>;
  @Input({required: true}) text!: string;
  @Input({required: true}) imageInfo!: { url: string, alt: string };
  @Output() onSelectedImage = new EventEmitter<string>();
  public originalImage = signal<HTMLImageElement|null>(null);
  public isDrawing = signal(false);
  public coords = signal({x: 0, y: 0});


  handleClick() {
    this.onSelectedImage.emit(this.originalImage()!.src);
  }

  onMouseDown(event: MouseEvent) {
    if(!this.canvasElement?.nativeElement) return;

    this.isDrawing.set(true);
    // Obtain coords from mouse relative to canvas
    const rect = this.canvasElement.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.coords.set({x, y});
  }

  onMouseMove(event: MouseEvent) {
    if(!this.isDrawing()) return;
    const canvasRef = this.canvasElement!.nativeElement;
    const rect = canvasRef.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate height and width of a rectangle
    const width = x - this.coords().x;
    const height = y - this.coords().y;

    const canvasWidth = canvasRef.width;
    const canvasHeight = canvasRef.height;

    const ctx = canvasRef.getContext('2d')!;
    ctx.clearRect(0,0, canvasRef.width, canvasRef.height);
    ctx.drawImage(this.originalImage()!, 0,0, canvasWidth, canvasHeight);
    ctx.clearRect(this.coords().x, this.coords().y, width, height);
  }

  onMouseUp(event: MouseEvent) {
    this.isDrawing.set(false);
    const canvas = this.canvasElement!.nativeElement;
    const url = canvas.toDataURL('image/png');
    this.onSelectedImage.emit(url);
  }

  ngAfterViewInit(): void {
     if (!this.canvasElement) return;

     const canvas = this.canvasElement.nativeElement;
     const ctx = canvas.getContext('2d');
     if (!ctx) return;
     const img = new Image();
     img.crossOrigin = 'Anonymous';
     img.src = this.imageInfo.url;
     this.originalImage.set(img);
     img.onload = () => {
       ctx.drawImage(img, 0,0, canvas.width, canvas.height);
     }
  }


 }
