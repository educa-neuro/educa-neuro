import { Component, AfterViewInit, OnDestroy, ElementRef, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-tienda',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './tienda.html',
  styleUrl: './tienda.scss',
})
export class Tienda implements AfterViewInit, OnDestroy {
  private el       = inject(ElementRef);
  private platform = inject(PLATFORM_ID);

  heroVisible     = signal(false);
  featsVisible    = signal(false);
  catsVisible     = signal(false);
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

    watch('.tienda-hero',        () => this.heroVisible.set(true));
    watch('.feats-2col',         () => this.featsVisible.set(true));
    watch('.cats-grid',          () => this.catsVisible.set(true));
    watch('.cta-tienda .cta-inner', () => this.ctaVisible.set(true));
  }

  ngOnDestroy() {
    this.observers.forEach(o => o.disconnect());
  }
}
