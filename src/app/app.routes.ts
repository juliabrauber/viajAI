import { Routes } from '@angular/router';
import { TripFormComponent } from './pages/trip-form/trip-form.component';
import { TripResultComponent } from './pages/trip-result/trip-result.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  {
    path: 'trip-form',
    component: TripFormComponent,
    data: { name: 'tripForm' },
  },
  {
    path: 'result',
    component: TripResultComponent,
    data: { name: 'tripResult' },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { name: 'about' },
  },
  { path: '', redirectTo: 'about', pathMatch: 'full' },
];
