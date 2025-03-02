import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { sessionGuard } from './core/guards/session.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'document-control-panel',
    pathMatch: 'full',
  },
  {
    path: 'document-control-panel',
    loadChildren: () =>
      import('./document-control-panel/document-control-panel.routes').then(r => r.routes),
    canActivate: [sessionGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
