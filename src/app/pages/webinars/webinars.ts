import { Component, AfterViewInit, OnDestroy, ElementRef, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-webinars',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './webinars.html',
  styleUrl: './webinars.scss',
})
export class Webinars implements AfterViewInit, OnDestroy {
  private el       = inject(ElementRef);
  private platform = inject(PLATFORM_ID);

  heroVisible     = signal(false);
  featuresVisible = signal(false);
  queVisible      = signal(false);
  proximosVisible = signal(false);
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

    watch('.webinars-hero',  () => this.heroVisible.set(true));
    watch('.features-row',   () => this.featuresVisible.set(true));
    watch('.que-grid',       () => this.queVisible.set(true));
    watch('.webinar-list',   () => this.proximosVisible.set(true));
    watch('.cta-webinars .cta-inner', () => this.ctaVisible.set(true));
  }

  ngOnDestroy() {
    this.observers.forEach(o => o.disconnect());
  }
}
