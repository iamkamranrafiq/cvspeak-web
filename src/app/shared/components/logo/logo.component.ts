import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 48 48"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient [attr.id]="gradId" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="44" height="44" rx="13" [attr.fill]="'url(#' + gradId + ')'"/>

      <!-- Document with speech-bubble tail -->
      <path d="M14 12 h18 a2 2 0 0 1 2 2 v18 a2 2 0 0 1 -2 2 h-8 l-5 4 v-4 h-5
               a2 2 0 0 1 -2 -2 v-18 a2 2 0 0 1 2 -2 z"
            fill="#ffffff" opacity=".97"/>

      <rect x="17" y="17"   width="14" height="2.4" rx="1.2" fill="#7c3aed"/>
      <rect x="17" y="22"   width="10" height="1.7" rx=".85" fill="#0b1226" opacity=".35"/>
      <rect x="17" y="25.2" width="12" height="1.7" rx=".85" fill="#0b1226" opacity=".35"/>
      <rect x="17" y="28.4" width="8"  height="1.7" rx=".85" fill="#0b1226" opacity=".35"/>

      <circle cx="37" cy="12" r="3.3" fill="#10b981"/>
      @if (animated) {
        <circle cx="37" cy="12" r="3.3" fill="none"
                stroke="#10b981" stroke-opacity=".55" stroke-width="1.6">
          <animate attributeName="r"              values="3.3;6.8;3.3" dur="2.4s" repeatCount="indefinite"/>
          <animate attributeName="stroke-opacity" values=".55;0;.55"   dur="2.4s" repeatCount="indefinite"/>
        </circle>
      }
    </svg>
  `,
  styles: [':host { display: inline-flex; }']
})
export class LogoComponent {
  @Input() size: string | number = 32;
  @Input() animated = false;          // pulse off by default - on for hero only
  // unique gradient ID per instance so multiple logos on a page don't collide
  gradId = `cvs-grad-${Math.random().toString(36).slice(2, 8)}`;
}
