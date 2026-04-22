import { Component, ElementRef, ViewChild, afterNextRender, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Servicios y módulos
import { MapService } from '../../services/map.service';
import { OlMap } from '../../modules/openlayers.module';

// Componentes relacionados
import { Menubar } from '../menubar/menubar';
import { Sidebar } from '../sidebar/sidebar';
import { OverviewMapComponent } from './components/overViewMap/overview-map';



/**
 * Componente principal de la interfaz del mapa.
 * Coordina la visualización de la barra de herramientas, barra lateral y los controles
 * interactivos del mapa central.
 */
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Menubar,
    Sidebar,
    OverviewMapComponent

  ],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent {
  /** Referencia al contenedor principal donde se inyecta el lienzo de OpenLayers */
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  /** Referencia al elemento HTML que se utiliza como marcador de ubicación del usuario */
  @ViewChild('userMarker') userMarker!: ElementRef;
  /** Referencia al elemento HTML del popup informativo de ubicación */
  @ViewChild('locationPopup') locationPopup!: ElementRef;

  private mapService = inject(MapService);
  private cdr = inject(ChangeDetectorRef);

  /** Referencia a la instancia de OpenLayers expuesta por el servicio */
  olMap?: OlMap;
  /** Signal que indica si el mapa ya terminó su carga inicial */
  isReady = this.mapService.isReady;
  /** Signal con las coordenadas actuales obtenidas por GPS */
  userCoords = this.mapService.userCoords;
  /** Signal que define si se muestra el mapa base de satélite o de calles */
  baseLayerType = this.mapService.baseLayerType;

  constructor() {
    // afterNextRender asegura que el mapa se inicialice solo en el cliente (navegador)
    afterNextRender(() => {
      this.initMap();
    });
  }

  /**
   * Solicita al servicio la creación de la instancia de OpenLayers pasando el
   * contenedor nativo del componente.
   */
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
   * Cambia el mapa base delegando la lógica al servicio
   */
  toggleBaseLayer(): void {
    this.mapService.toggleBaseLayer();
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
