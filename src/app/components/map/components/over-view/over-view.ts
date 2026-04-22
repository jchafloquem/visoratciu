import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente que actúa como contenedor para el mini-mapa (Overview Map).
 * Proporciona el elemento del DOM donde OpenLayers renderizará la vista general.
 */
@Component({
  selector: 'app-over-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './over-view.html',
  styleUrl: './over-view.css'
})
export class OverViewComponent {}
