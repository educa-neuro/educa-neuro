import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly STORAGE_KEY = 'en_lang';
  currentLang = signal<'es' | 'en'>('es');

  constructor(private translate: TranslateService) {
    const saved = localStorage.getItem(this.STORAGE_KEY) as 'es' | 'en' | null;
    const lang = saved ?? 'es';
    this.currentLang.set(lang);
    this.translate.use(lang);
  }

  toggle() {
    const next = this.currentLang() === 'es' ? 'en' : 'es';
    this.currentLang.set(next);
    this.translate.use(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  }

  setLang(lang: 'es' | 'en') {
    this.currentLang.set(lang);
    this.translate.use(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
  }
}
