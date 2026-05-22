import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const KEY = 'cvspeak.session-token';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  get token(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(KEY);
  }

  set token(value: string | null) {
    if (!this.isBrowser) return;
    if (value) localStorage.setItem(KEY, value);
    else       localStorage.removeItem(KEY);
  }

  clear(): void { this.token = null; }
}
