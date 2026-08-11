import { Routes } from '@angular/router';

const SITE_TITLE = 'EducaNeuro | Formación en Neurodiversidad e Inclusión';
const SITE_DESC = 'Formación y recursos para comprender, acompañar e incluir. Capacitación basada en evidencia y enfoque neuroafirmativo para familias, docentes y profesionales.';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home),
    data: { title: SITE_TITLE, description: SITE_DESC },
  },
  {
    path: 'servicios', loadComponent: () => import('./pages/servicios/servicios-list/servicios-list').then(m => m.ServiciosList),
    data: {
      title: 'Servicios | EducaNeuro',
      description: 'Acompañamiento psicopedagógico neuroafirmativo: sesiones individuales, apoyo a familias, educación en casa y formación para docentes en Bolivia.',
    },
  },
  { path: 'servicios/:slug', loadComponent: () => import('./pages/servicios/servicio-detalle/servicio-detalle').then(m => m.ServicioDetalle) },
  {
    path: 'cursos', loadComponent: () => import('./pages/cursos/cursos').then(m => m.Cursos),
    data: {
      title: 'Cursos | EducaNeuro',
      description: 'Cursos online con enfoque neuroafirmativo sobre autismo, TDAH, síndrome de Down y dificultades de aprendizaje para familias y docentes.',
    },
  },
  {
    path: 'recursos', loadComponent: () => import('./pages/recursos/recursos').then(m => m.Recursos),
    data: {
      title: 'Recursos Gratuitos | EducaNeuro',
      description: 'Guías, materiales descargables y herramientas gratuitas para acompañar el aprendizaje y el desarrollo desde un enfoque neuroafirmativo.',
    },
  },
  {
    path: 'webinars', loadComponent: () => import('./pages/webinars/webinars').then(m => m.Webinars),
    data: {
      title: 'Webinars | EducaNeuro',
      description: 'Webinars en vivo sobre neurodiversidad, autismo, TDAH y estrategias de acompañamiento para familias, educadoras y docentes.',
    },
  },
  {
    path: 'tienda', loadComponent: () => import('./pages/tienda/tienda').then(m => m.Tienda),
    data: {
      title: 'Tienda | EducaNeuro',
      description: 'Materiales digitales y físicos diseñados para facilitar el aprendizaje, la autonomía y la inclusión.',
    },
  },
  {
    path: 'sobre-mi', loadComponent: () => import('./pages/sobre-mi/sobre-mi').then(m => m.SobreMi),
    data: {
      title: 'Sobre mí | EducaNeuro',
      description: 'Conoce a la especialista detrás de EducaNeuro: psicopedagoga inclusiva con enfoque neuroafirmativo en condiciones del neurodesarrollo.',
    },
  },
  { path: '**', redirectTo: '' }
];
