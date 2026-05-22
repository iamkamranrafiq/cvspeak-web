import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="dropzone" [class.is-dragover]="dragOver()" [class.has-file]="file()">
      <input #fi type="file" [accept]="accept" (change)="onPick($any($event.target).files)"
             (dragover)="prevent($event); dragOver.set(true)"
             (dragleave)="dragOver.set(false)"
             (drop)="onDrop($event)"
             hidden />
      <div class="dropzone__inner"
           (dragover)="prevent($event); dragOver.set(true)"
           (dragleave)="dragOver.set(false)"
           (drop)="onDrop($event)"
           (click)="fi.click()">
        <div class="dropzone__icon">📄</div>
        <h3 *ngIf="!file()">{{ heading }}</h3>
        <h3 *ngIf="file()">{{ file()!.name }}</h3>
        <p *ngIf="!file()">Drag & drop, or click to browse. PDF, DOCX, TXT. Max 5 MB.</p>
        <p *ngIf="file()" class="dropzone__size">{{ formatSize(file()!.size) }}</p>
      </div>
    </label>
  `,
  styles: [`
    .dropzone {
      display: block; padding: 2.5rem; border-radius: 16px;
      border: 2px dashed var(--border-strong);
      background: linear-gradient(180deg, var(--surface-1), var(--surface-0));
      transition: all .2s ease;
      cursor: pointer;
    }
    .dropzone:hover, .dropzone.is-dragover {
      border-color: var(--brand-500);
      background: linear-gradient(180deg, var(--brand-50), var(--surface-0));
    }
    .dropzone.has-file { border-style: solid; border-color: var(--brand-500); }
    .dropzone__inner { text-align: center; pointer-events: none; }
    .dropzone__icon  { font-size: 2.6rem; }
    .dropzone h3     { margin: .9rem 0 .3rem; font-size: 1.1rem; }
    .dropzone p      { color: var(--text-muted); margin: 0; font-size: .92rem; }
    .dropzone__size  { font-weight: 600; color: var(--brand-500); }
  `]
})
export class FileUploadComponent {
  @Input() heading = 'Drop your resume here';
  @Input() accept  = '.pdf,.docx,.doc,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  @Output() fileSelected = new EventEmitter<File>();

  file     = signal<File | null>(null);
  dragOver = signal(false);

  onPick(files: FileList | null): void {
    if (!files || !files.length) return;
    const f = files[0];
    this.file.set(f);
    this.fileSelected.emit(f);
  }
  onDrop(e: DragEvent): void {
    this.prevent(e);
    this.dragOver.set(false);
    this.onPick(e.dataTransfer?.files ?? null);
  }
  prevent(e: Event): void { e.preventDefault(); e.stopPropagation(); }
  formatSize(b: number): string {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / (1024 * 1024)).toFixed(2) + ' MB';
  }
}
