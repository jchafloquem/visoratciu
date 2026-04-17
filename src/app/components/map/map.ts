import { Component, ElementRef, ViewChild, afterNextRender, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapService, INITIAL_CENTER, INITIAL_ZOOM } from '../../services/map.service';
import { OlMap, fromLonLat } from '../../modules/openlayers.module';

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
  olMap?: OlMap;
  isReady = false; // Estado para controlar la visibilidad inicial

  private mapService = inject(MapService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // afterNextRender asegura que el mapa se inicialice solo en el cliente (navegador)
    afterNextRender(() => {
      this.initMap();
    });
  }
  private initMap(): void {
    // Utilizamos el servicio para inicializar el mapa centralizando la lógica
    this.olMap = this.mapService.initMap(this.mapContainer.nativeElement);

    // Activamos el estado isReady para mostrar los controles en el HTML
    this.isReady = true;

    // Forzamos la detección de cambios para que el @if en el HTML se active
    this.cdr.detectChanges();
  }

  /**
   * Incrementa el nivel de zoom actual del mapa
   */
  zoomIn(): void {
    const view = this.olMap?.getView();
    const zoom = view?.getZoom();
    if (view && zoom !== undefined) {
      view.animate({ zoom: zoom + 1, duration: 250 });
    }
  }

  /**
   * Decrementa el nivel de zoom actual del mapa
   */
  zoomOut(): void {
    const view = this.olMap?.getView();
    const zoom = view?.getZoom();
    if (view && zoom !== undefined) {
      view.animate({ zoom: zoom - 1, duration: 250 });
    }
  }

  /**
   * Restablece la vista a la posición inicial (Perú)
   */
  goHome(): void {
    this.olMap?.getView().animate({
      center: fromLonLat(INITIAL_CENTER),
      zoom: INITIAL_ZOOM,
      duration: 500 // Animación de medio segundo
    });
  }

  /**
   * Obtiene la ubicación actual del usuario y centra el mapa
   */
  getCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.longitude, position.coords.latitude];

          // Hacemos visible el marcador (estaba en display: none en el CSS)
          this.userMarker.nativeElement.style.display = 'flex';

          // Actualizar el Overlay animado
          this.mapService.updateUserLocationOverlay(coords, this.userMarker.nativeElement);

          this.olMap?.getView().animate({
            center: fromLonLat(coords),
            zoom: 17, // Zoom cercano para la ubicación
            duration: 1000
          });
        },
        (error) => {
          console.warn('Error al obtener la ubicación:', error);
        }
      );
    } else {
      alert('La geolocalización no está disponible en su navegador.');
    }
  }

}
