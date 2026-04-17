import { Routes } from '@angular/router';
import { MapComponent } from './components/map/map';

export const routes: Routes = [
 {
  path: 'map',
  component: MapComponent,
  title: 'Visor Atención al Ciudadano'
 },
 {
  path: '',
  redirectTo: 'map',
  pathMatch: 'full'
 }
];
