import { Component, signal, OnInit, OnDestroy, inject, isDevMode, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRouteSnapshot } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';

const SITE_URL = 'https://www.educaneuro.com';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    @if (loading()) {
      <div class="loader-overlay" [class.fade-out]="fadeOut()">
        <div class="loader-particles">
          @for (p of particles; track p) {
            <div class="particle" [style]="p"></div>
          }
        </div>
        <div class="loader-center">
          <div class="loader-glow"></div>
          <img src="assets/images/educa-neuro-loader.png" alt="EducaNeuro" class="loader-logo" />
        </div>
        <div class="loader-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    }

    <!-- Nav loader: barra superior + overlay -->
    @if (navLoading()) {
      <div class="nav-progress-bar">
        <div class="nav-progress-fill"></div>
      </div>
      <div class="nav-overlay"></div>
    }

    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>

    <!-- Botones flotantes de contacto -->
    <div class="fab-stack" [class.fab-visible]="waVisible()">
      <a
        class="tg-fab"
        href="https://t.me/shirleyvillegasv"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por Telegram"
      >
        <span class="tg-tooltip">¡Escríbenos por Telegram!</span>
        <svg class="tg-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.05 3.148a1.65 1.65 0 00-1.685-.29L2.6 9.72c-.996.386-.986 1.822.017 2.19l4.552 1.67 1.771 5.674c.213.681 1.081.897 1.582.393l2.507-2.522 4.36 3.213c.752.554 1.833.152 2.045-.762l3.462-14.94a1.65 1.65 0 00-.417-1.49zM9.5 13.94l-.9 3.31-.986-3.157 9.09-6.826c.176-.132-.02-.402-.213-.293L9.5 13.94z"/>
        </svg>
      </a>
      <a
        class="wa-fab"
        href="https://wa.me/59173029878?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20cursos%20y%20recursos%20de%20EducaNeuro%20%F0%9F%A7%A0%E2%9C%A8"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
      >
        <span class="wa-tooltip">¡Escríbenos por WhatsApp!</span>
        <span class="wa-pulse"></span>
        <svg class="wa-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  `,
  styles: [`
    main { min-height: 100vh; }

    .loader-overlay {
      position: fixed;
      inset: 0;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2.5rem;
      z-index: 9999;
      opacity: 1;
      transition: opacity 0.7s ease;
      overflow: hidden;
    }

    .loader-overlay.fade-out {
      opacity: 0;
      pointer-events: none;
    }

    /* Partículas flotantes de fondo */
    .loader-particles {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .particle {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      animation: float-up linear infinite;
    }

    @keyframes float-up {
      0%   { transform: translateY(0) scale(0.5); opacity: 0; }
      10%  { opacity: 0.6; }
      90%  { opacity: 0.3; }
      100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
    }

    /* Centro: glow + logo */
    .loader-center {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loader-glow {
      position: absolute;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(46,125,50,0.12) 0%, rgba(2,51,103,0.08) 50%, transparent 70%);
      animation: glow-pulse 2s ease-in-out infinite;
    }

    @keyframes glow-pulse {
      0%, 100% { transform: scale(1);    opacity: 1; }
      50%       { transform: scale(1.25); opacity: 0.6; }
    }

    .loader-logo {
      width: clamp(130px, 30vw, 210px);
      height: auto;
      position: relative;
      z-index: 1;
      animation: drop-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    @keyframes drop-in {
      from { transform: translateY(-40px) scale(0.8); opacity: 0; }
      to   { transform: translateY(0)     scale(1);   opacity: 1; }
    }

    /* Tres puntos animados */
    .loader-dots {
      display: flex;
      gap: 0.6rem;
      align-items: center;
    }

    .loader-dots span {
      display: block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: bounce-dot 1.2s ease-in-out infinite;
    }

    .loader-dots span:nth-child(1) { background: #2e7d32; animation-delay: 0s; }
    .loader-dots span:nth-child(2) { background: #023367; animation-delay: 0.2s; }
    .loader-dots span:nth-child(3) { background: #f57c00; animation-delay: 0.4s; }

    @keyframes bounce-dot {
      0%, 80%, 100% { transform: scale(0.7) translateY(0);   opacity: 0.5; }
      40%            { transform: scale(1.2) translateY(-8px); opacity: 1; }
    }

    /* ===== BOTONES FLOTANTES DE CONTACTO ===== */
    .fab-stack {
      position: fixed;
      bottom: 1.75rem;
      right: 1.75rem;
      z-index: 9000;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.85rem;
    }

    .tg-fab, .wa-fab {
      position: relative;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: #fff;
      opacity: 0;
      transform: translateY(20px) scale(0.8);
      transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1),
                  background 0.2s ease, box-shadow 0.2s ease;
      pointer-events: none;
    }

    .fab-stack.fab-visible .tg-fab,
    .fab-stack.fab-visible .wa-fab {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .wa-fab {
      background: #25d366;
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.45);
    }

    .wa-fab:hover {
      background: #1ebe5d;
      box-shadow: 0 6px 28px rgba(37, 211, 102, 0.6);
      transform: scale(1.1);
    }

    .tg-fab {
      background: #26a5e4;
      box-shadow: 0 4px 20px rgba(38, 165, 228, 0.45);
    }

    .tg-fab:hover {
      background: #1e8fc7;
      box-shadow: 0 6px 28px rgba(38, 165, 228, 0.6);
      transform: scale(1.1);
    }

    .wa-icon, .tg-icon {
      width: 30px;
      height: 30px;
      position: relative;
      z-index: 1;
    }

    .tg-icon { width: 27px; height: 27px; }

    /* Anillo de pulso */
    .wa-pulse {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba(37, 211, 102, 0.4);
      animation: wa-pulse 2.2s ease-out infinite;
    }

    @keyframes wa-pulse {
      0%   { transform: scale(1);   opacity: 0.7; }
      70%  { transform: scale(1.6); opacity: 0; }
      100% { transform: scale(1.6); opacity: 0; }
    }

    /* Tooltips */
    .wa-tooltip, .tg-tooltip {
      position: absolute;
      right: calc(100% + 12px);
      top: 50%;
      transform: translateY(-50%) translateX(6px);
      background: #1a3a5c;
      color: #fff;
      font-size: 0.78rem;
      font-weight: 500;
      white-space: nowrap;
      padding: 0.4rem 0.75rem;
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .wa-tooltip::after, .tg-tooltip::after {
      content: '';
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-left-color: #1a3a5c;
    }

    .wa-fab:hover .wa-tooltip,
    .tg-fab:hover .tg-tooltip {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }

    /* ===== NAV LOADER ===== */
    .nav-progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      z-index: 10000;
      background: rgba(46, 125, 50, 0.15);
      overflow: hidden;
    }

    .nav-progress-fill {
      height: 100%;
      width: 100%;
      background: linear-gradient(90deg, #2e7d32, #00838f, #023367, #f57c00);
      background-size: 300% 100%;
      animation: nav-slide 1s ease-in-out infinite, nav-color 2s linear infinite;
      transform-origin: left;
    }

    @keyframes nav-slide {
      0%   { transform: translateX(-100%); }
      50%  { transform: translateX(0%); }
      100% { transform: translateX(100%); }
    }

    @keyframes nav-color {
      0%   { background-position: 0% 50%; }
      100% { background-position: 300% 50%; }
    }

    .nav-overlay {
      position: fixed;
      inset: 0;
      background: rgba(255, 255, 255, 0.35);
      backdrop-filter: blur(1px);
      z-index: 9998;
      animation: nav-overlay-in 0.15s ease forwards;
    }

    @keyframes nav-overlay-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `]
})
export class App implements OnInit, OnDestroy {
  loading    = signal(true);
  fadeOut    = signal(false);
  navLoading = signal(false);
  waVisible  = signal(false);

  private router = inject(Router);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private swUpdate = inject(SwUpdate);
  private platform = inject(PLATFORM_ID);
  private sub!: Subscription;
  private swSub?: Subscription;
  private navTimer: ReturnType<typeof setTimeout> | null = null;

  readonly particles = Array.from({ length: 18 }, () => {
    const colors = ['#2e7d32', '#023367', '#f57c00', '#7b1fa2', '#00838f'];
    const size = Math.random() * 10 + 5;
    return [
      `left:${Math.random() * 100}%`,
      `bottom:${Math.random() * -10}%`,
      `width:${size}px`,
      `height:${size}px`,
      `background:${colors[Math.floor(Math.random() * colors.length)]}`,
      `animation-duration:${Math.random() * 4 + 4}s`,
      `animation-delay:${Math.random() * 4}s`,
    ].join(';');
  });

  ngOnInit() {
    setTimeout(() => this.fadeOut.set(true), 2000);
    setTimeout(() => this.loading.set(false), 2700);
    setTimeout(() => this.waVisible.set(true), 3200);

    this.initSwUpdates();

    this.sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.navLoading.set(true);
        if (this.navTimer) clearTimeout(this.navTimer);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.navTimer = setTimeout(() => this.navLoading.set(false), 400);
        if (event instanceof NavigationEnd) this.updateMetaTags(event.urlAfterRedirects);
      }
    });
  }

  private initSwUpdates() {
    if (!isPlatformBrowser(this.platform) || isDevMode() || !this.swUpdate.isEnabled) return;

    this.swSub = this.swUpdate.versionUpdates
      .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
      .subscribe(() => {
        this.swUpdate.activateUpdate().then(() => location.reload());
      });

    // Comprueba si hay una versión nueva apenas arranca la app, además
    // de las comprobaciones periódicas que hace el propio Service Worker.
    this.swUpdate.checkForUpdate();
  }

  private updateMetaTags(url: string) {
    let route: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    const data = route.data as { title?: string; description?: string };
    if (!data['title'] && !data['description']) return;

    const title = data['title'] ?? this.titleService.getTitle();
    const description = data['description'] ?? '';

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: `${SITE_URL}${url}` });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.swSub?.unsubscribe();
    if (this.navTimer) clearTimeout(this.navTimer);
  }
}
