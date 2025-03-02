import { Routes } from '@angular/router';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentControlPanelLayoutComponent } from './components/document-control-panel-layout/document-control-panel-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: DocumentControlPanelLayoutComponent,
    children: [
      {
        path: '',
        component: DocumentListComponent,
      },
    ],
  },
];
