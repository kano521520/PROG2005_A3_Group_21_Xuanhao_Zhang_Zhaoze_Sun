import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'inventory-list',
        loadComponent: () => import('../inventory-list/inventory-list.component').then((m) => m.InventoryListComponent),
      },
      {
        path: 'add-featured',
        loadComponent: () => import('../add-featured/add-featured.component').then((m) => m.AddFeaturedComponent),
      },
      {
        path: 'edit-delete',
        loadComponent: () => import('../edit-delete/edit-delete.component').then((m) => m.EditDeleteComponent),
      },
      {
        path: 'privacy-security',
        loadComponent: () => import('../privacy-security/privacy-security.component').then((m) => m.PrivacySecurityComponent),
      },
      {
        path: '',
        redirectTo: '/tabs/inventory-list',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/inventory-list',
    pathMatch: 'full',
  },
];