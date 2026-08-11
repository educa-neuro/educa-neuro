import { Component, AfterViewInit, OnDestroy, ElementRef, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SERVICIOS } from '../servicios.data';

@Component({
  selector: 'app-servicios-list',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.scss',
})
export class ServiciosList implements AfterViewInit, OnDestroy {
  private el       = inject(ElementRef);
  private platform = inject(PLATFORM_ID);

  readonly servicios = SERVICIOS;

  heroVisible       = signal(false);
  gridVisible       = signal(false);
  conditionsVisible = signal(false);
  ctaVisible        = signal(false);

  private observers: IntersectionObserver[] = [];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platform)) return;

    const watch = (selector: string, setter: () => void) => {
      const el = this.el.nativeElement.querySelector(selector);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setter(); obs.disconnect(); } },
        { threshold: 0.12 }
      );
      obs.observe(el);
      this.observers.push(obs);
    };

    this.heroVisible.set(true);
    watch('.servicios-grid',     () => this.gridVisible.set(true));
    watch('.conditions-section', () => this.conditionsVisible.set(true));
    watch('.cta-servicios .cta-inner', () => this.ctaVisible.set(true));
  }

  ngOnDestroy() {
    this.observers.forEach(o => o.disconnect());
  }
}
