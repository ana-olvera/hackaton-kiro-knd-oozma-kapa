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
    path: 'achievements',
    loadComponent: () =>
      import('./ui/achievements/achievements.component').then(m => m.AchievementsComponent)
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./ui/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
