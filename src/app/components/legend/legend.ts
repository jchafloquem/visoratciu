import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-legend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legend.html',
  styleUrl: './legend.css',
})
export class LegendComponent {
  @Input() layers: any[] = [];

  private mapService = inject(MapService);

  /**
   * Obtiene la URL de la leyenda desde el servicio
   */
  /* getLegendUrl(layer: any): string | undefined {
    return this.mapService.getLegendUrl(layer);
  } */

  /**
   * Verifica si hay al menos una capa con leyenda visible para mostrar el panel
   */
  /* hasVisibleLegends(): boolean {
    return this.layers.some(l => l.getVisible() && this.getLegendUrl(l));
  } */
}
