import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '@env/environment';

/**
 * Non-intrusive AdSlot. Stays disabled until you flip
 * environment.adsense.enabled = true after AdSense approval.
 *
 * Placement rules baked in:
 *  - Never inside hero / CTA / analysis result areas
 *  - Only in sidebars, between content blocks, or footer of long pages
 *  - Always behind a subtle "Sponsored" label
 *  - Reserves space (min-height) so layout doesn't shift when ad loads
 *
 * Variants:
 *   variant="inline"   - in-content rectangle (between blog paragraphs, etc.)
 *   variant="sidebar"  - sidebar rail unit
 *   variant="footer"   - bottom-of-article placement
 */
@Component({
  selector: 'app-ad-slot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside *ngIf="enabled" class="adslot adslot--{{ variant }}" [attr.aria-label]="'Sponsored content'">
      <div class="adslot__label">Sponsored</div>
      <ins class="adsbygoogle"
           style="display:block"
           [attr.data-ad-client]="clientId"
           [attr.data-ad-slot]="slotId"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </aside>
  `,
  styles: [`
    .adslot {
      margin: 2rem 0;
      padding: .75rem;
      border: 1px dashed var(--border-soft);
      border-radius: 12px;
      background: var(--surface-1);
      min-height: 120px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .adslot--inline   { min-height: 250px; }
    .adslot--sidebar  { min-height: 600px; max-width: 300px; }
    .adslot--footer   { min-height: 100px; }
    .adslot__label {
      font-size: .7rem; text-transform: uppercase; letter-spacing: .08em;
      color: var(--text-muted); margin-bottom: .35rem; align-self: flex-end;
    }
  `]
})
export class AdSlotComponent {
  @Input() slotId!: string;
  @Input() variant: 'inline' | 'sidebar' | 'footer' = 'inline';

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  get enabled(): boolean { return environment.adsense.enabled && !!environment.adsense.clientId && !!this.slotId; }
  get clientId(): string { return environment.adsense.clientId; }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.enabled) return;
    try {
      // AdSense push - script tag is added once in app component when enabled.
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch { /* silent in SSR / blocker / pre-approval */ }
  }
}
