import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { AboutPage } from './pages/about-page/about-page';
import { LoginPage } from './pages/login-page/login-page';
import { FeaturesPage } from './pages/features-page/features-page';
import { WithNavbarLayout } from './with-navbar-layout/with-navbar-layout';
import { Dashboard } from './pages/dashboard-pages/dashboard-page';
import { Register } from './pages/register/register';
import { Management } from './pages/dashboard-pages/projects/main.projects';
import { Settings } from './pages/dashboard-pages/settings/settings';
import { Protected } from './services/protected';
import { ProjectPage } from './pages/dashboard-pages/projects/project-page/project-page';
import { BoardPage } from './pages/dashboard-pages/projects/board-page/board-page';

export const routes: Routes = [
  {
    path: '',
    component: WithNavbarLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'feature', component: FeaturesPage },
      { path: 'about', component: AboutPage },
    ],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [Protected],
    children: [
      { path: 'projects', component: Management },
      {
        path: 'projects/:project_id',
        component: ProjectPage,
      },
      { path: 'projects/:project_id/boards/:board_id', component: BoardPage },

      { path: 'settings', component: Settings },
      { path: '', redirectTo: 'projects', pathMatch: 'prefix' },
    ],
  },
  { path: 'login', component: LoginPage },
  { path: 'register', component: Register },
];
