import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

const KEY = 'cvspeak.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private doc = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<'light' | 'dark'>('light');

  constructor() {
    if (!this.isBrowser) return;
    const stored = (localStorage.getItem(KEY) as 'light' | 'dark' | null);
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.set(stored ?? prefers);
  }

  toggle(): void {
    this.set(this.theme() === 'light' ? 'dark' : 'light');
  }

  set(value: 'light' | 'dark'): void {
    this.theme.set(value);
    if (!this.isBrowser) return;
    this.doc.documentElement.setAttribute('data-theme', value);
    localStorage.setItem(KEY, value);
  }
}
