import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';

// Routes for the application
export const routes: Routes = [
  { path: '', component: MapComponent },
  { path: 'map', component: MapComponent },
  { path: '**', redirectTo: '' }
];
