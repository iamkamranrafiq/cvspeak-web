import { CommonModule } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';

@Component({
  selector: 'app-score-ring',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ring-wrap">
      <div class="ring" [style.width.px]="size" [style.height.px]="size">
        <svg [attr.viewBox]="'0 0 ' + size + ' ' + size">
          <circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="r" fill="none" stroke="var(--surface-2)" [attr.stroke-width]="stroke"/>
          <circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="r" fill="none" [attr.stroke]="ringColor()" [attr.stroke-width]="stroke"
                  [attr.stroke-dasharray]="circumference()"
                  [attr.stroke-dashoffset]="dashOffset()"
                  stroke-linecap="round"
                  [attr.transform]="'rotate(-90 ' + cx + ' ' + cy + ')'" />
        </svg>
        <div class="ring__center">
          <div class="ring__value" [style.color]="ringColor()" [style.fontSize.px]="size * 0.3">{{ value }}</div>
        </div>
      </div>
      <div class="ring__label" [style.maxWidth.px]="size + 24">{{ label }}</div>
    </div>
  `,
  styles: [`
    .ring-wrap { display: inline-flex; flex-direction: column; align-items: center; gap: .45rem; }
    .ring { position: relative; }
    .ring svg { width: 100%; height: 100%; }
    .ring__center { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
    .ring__value { font-weight: 800; line-height: 1; }
    .ring__label { font-size: .72rem; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--text-muted); text-align: center; line-height: 1.2; }
  `]
})
export class ScoreRingComponent {
  @Input() value = 0;
  @Input() label = 'Score';
  @Input() size  = 140;
  @Input() stroke = 10;

  get cx() { return this.size / 2; }
  get cy() { return this.size / 2; }
  get r()  { return (this.size - this.stroke) / 2; }
  circumference() { return 2 * Math.PI * this.r; }
  dashOffset() { return this.circumference() * (1 - Math.min(100, Math.max(0, this.value)) / 100); }
  ringColor() {
    const v = this.value;
    if (v >= 80) return '#10b981';
    if (v >= 60) return '#3b82f6';
    if (v >= 40) return '#f59e0b';
    return '#ef4444';
  }
}
