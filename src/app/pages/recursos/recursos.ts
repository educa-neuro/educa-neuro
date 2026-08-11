import { Component, AfterViewInit, OnDestroy, ElementRef, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-recursos',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './recursos.html',
  styleUrl: './recursos.scss',
})
export class Recursos implements AfterViewInit, OnDestroy {
  private el       = inject(ElementRef);
  private platform = inject(PLATFORM_ID);

  heroVisible     = signal(false);
  featuresVisible = signal(false);
  tiposVisible    = signal(false);
  queVisible      = signal(false);
  ctaVisible      = signal(false);

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

    watch('.recursos-hero',    () => this.heroVisible.set(true));
    watch('.features-row',     () => this.featuresVisible.set(true));
    watch('.tipos-grid',       () => this.tiposVisible.set(true));
    watch('.que-box',          () => this.queVisible.set(true));
    watch('.cta-recursos .cta-inner', () => this.ctaVisible.set(true));
  }

  ngOnDestroy() {
    this.observers.forEach(o => o.disconnect());
  }
}
