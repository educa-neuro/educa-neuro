import { Component, AfterViewInit, OnDestroy, ElementRef, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cursos',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './cursos.html',
  styleUrl: './cursos.scss',
})
export class Cursos implements AfterViewInit, OnDestroy {
  private el       = inject(ElementRef);
  private platform = inject(PLATFORM_ID);

  heroVisible     = signal(false);
  featuresVisible = signal(false);
  catsVisible     = signal(false);
  whyVisible      = signal(false);
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

    watch('.cursos-hero',         () => this.heroVisible.set(true));
    watch('.features-row',        () => this.featuresVisible.set(true));
    watch('.cats-grid',           () => this.catsVisible.set(true));
    watch('.why-box',             () => this.whyVisible.set(true));
    watch('.cta-cursos .cta-inner', () => this.ctaVisible.set(true));
  }

  ngOnDestroy() {
    this.observers.forEach(o => o.disconnect());
  }
}
