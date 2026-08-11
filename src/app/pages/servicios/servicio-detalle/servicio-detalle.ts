import { Component, AfterViewInit, OnDestroy, ElementRef, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SERVICIOS, Servicio, getServicio } from '../servicios.data';

@Component({
  selector: 'app-servicio-detalle',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './servicio-detalle.html',
  styleUrl: './servicio-detalle.scss',
})
export class ServicioDetalle implements AfterViewInit, OnDestroy {
  private el       = inject(ElementRef);
  private platform = inject(PLATFORM_ID);
  private route     = inject(ActivatedRoute);
  private router    = inject(Router);
  private titleService = inject(Title);
  private metaService  = inject(Meta);
  private translate     = inject(TranslateService);

  servicio!: Servicio;
  key = '';
  bullets: number[] = [];

  heroVisible    = signal(false);
  contactVisible = signal(false);

  private observers: IntersectionObserver[] = [];

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const found = getServicio(slug);
    if (!found) {
      this.router.navigate(['/servicios']);
      return;
    }
    this.servicio = found;
    const index = SERVICIOS.findIndex(s => s.slug === slug);
    this.key = 's' + (index + 1);
    this.bullets = Array.from({ length: found.bulletCount }, (_, i) => i + 1);

    const title = `${this.translate.instant('servicios.' + this.key + '.title')} | EducaNeuro`;
    const description = this.translate.instant('servicios.' + this.key + '.desc');
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: `https://www.educaneuro.com/servicios/${slug}` });
  }

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
    watch('.detalle-contact .cta-inner', () => this.contactVisible.set(true));
  }

  ngOnDestroy() {
    this.observers.forEach(o => o.disconnect());
  }
}
