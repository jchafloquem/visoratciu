import { Component, ElementRef, ViewChild, afterNextRender, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapService } from '../../services/map.service';
import OlMap from 'ol/Map';


import { Menubar } from '../menubar/menubar';
import { Sidebar } from '../sidebar/sidebar';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Menubar,
    Sidebar
  ],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  olMap?: OlMap;
  isReady = false; // Estado para controlar la visibilidad inicial

  private mapService = inject(MapService);
  constructor() {
    // afterNextRender asegura que el mapa se inicialice solo en el cliente (navegador)
    afterNextRender(() => {
      this.initMap();
    });
  }
  private initMap(): void {
    // Utilizamos el servicio para inicializar el mapa centralizando la lógica
    this.olMap = this.mapService.initMap(this.mapContainer.nativeElement);
  }


}
