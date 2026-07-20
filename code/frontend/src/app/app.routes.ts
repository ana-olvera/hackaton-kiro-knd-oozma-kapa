import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/menus/main-menu/main-menu.component').then(m => m.MainMenuComponent)
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./game/game.component').then(m => m.GameComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
