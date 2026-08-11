import { Component, AfterViewInit, OnDestroy, ElementRef, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sobre-mi',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './sobre-mi.html',
  styleUrl: './sobre-mi.scss',
})
export class SobreMi implements AfterViewInit, OnDestroy {
  private el       = inject(ElementRef);
  private platform = inject(PLATFORM_ID);

  heroVisible     = signal(false);
  perfilVisible   = signal(false);
  pilaresVisible  = signal(false);
  acompanoVisible = signal(false);
  talleresVisible = signal(false);
  valoresVisible  = signal(false);
  ctaVisible      = signal(false);

  private observers: IntersectionObserver[] = [];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platform)) return;

    const watch = (selector: string, setter: () => void) => {
      const el = this.el.nativeElement.querySelector(selector);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setter(); obs.disconnect(); } },
        { threshold: 0.1 }
      );
      obs.observe(el);
      this.observers.push(obs);
    };

    watch('.foto-col',      () => this.heroVisible.set(true));
    watch('.perfil-col',    () => this.perfilVisible.set(true));
    watch('.pilares-grid',  () => this.pilaresVisible.set(true));
    watch('.acompano-grid', () => this.acompanoVisible.set(true));
    watch('.talleres-col',  () => this.talleresVisible.set(true));
    watch('.valores-grid',  () => this.valoresVisible.set(true));
    watch('.cta-sobre .cta-inner', () => this.ctaVisible.set(true));
  }

  ngOnDestroy() {
    this.observers.forEach(o => o.disconnect());
  }
}
