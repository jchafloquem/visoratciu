import { Component, ElementRef, ViewChild, afterNextRender, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapService } from '../../services/map.service';
import { OlMap } from '../../modules/openlayers.module';

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
  @ViewChild('userMarker') userMarker!: ElementRef;
  @ViewChild('locationPopup') locationPopup!: ElementRef;

  private mapService = inject(MapService);
  private cdr = inject(ChangeDetectorRef);

  olMap?: OlMap;
  isReady = this.mapService.isReady;
  userCoords = this.mapService.userCoords;

  constructor() {
    // afterNextRender asegura que el mapa se inicialice solo en el cliente (navegador)
    afterNextRender(() => {
      this.initMap();
    });
  }
  private initMap(): void {
    // Utilizamos el servicio para inicializar el mapa centralizando la lógica
    this.olMap = this.mapService.initMap(this.mapContainer.nativeElement);
    // Forzamos la detección de cambios para que el @if en el HTML se active
    this.cdr.detectChanges();
  }
  /**
   * Incrementa el nivel de zoom actual del mapa
   */
  zoomIn(): void {
    this.mapService.zoomIn();
  }
  /**
   * Decrementa el nivel de zoom actual del mapa
   */
  zoomOut(): void {
    this.mapService.zoomOut();
  }
  /**
   * Restablece la vista a la posición inicial (Perú)
   */
  goHome(): void {
    this.mapService.goHome();
  }
  /**
   * Obtiene la ubicación actual delegando la lógica al servicio
   */
  getCurrentLocation(): void {
    this.mapService.getCurrentLocation(this.userMarker.nativeElement, this.locationPopup.nativeElement)
      .catch(error => alert(error.message));
  }
  /**
   * Oculta el marcador y el popup delegando la lógica al servicio
   */
  removeLocationMarker(): void {
    this.mapService.clearUserLocation();
  }
}
