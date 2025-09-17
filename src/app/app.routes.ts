import { Routes } from '@angular/router';
import { TripFormComponent } from './components/trip-form/trip-form.component';
import { TripResultComponent } from './components/trip-result/trip-result.component';

export const routes: Routes = [
  {
    path: 'tripForm',
    component: TripFormComponent,
    data: { name: 'tripForm' },
  },
  {
    path: 'resultado',
    component: TripResultComponent,
    data: { name: 'tripResult' },
  },
  { path: '', redirectTo: 'tripForm', pathMatch: 'full' },
];
