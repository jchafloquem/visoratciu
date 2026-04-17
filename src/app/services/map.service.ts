import { Injectable, inject } from '@angular/core';
import {
  Circle,
  defaultControls,
  Feature,
  Fill,
  fromLonLat,
  OlMap,
  OverviewMap,
  Overlay,
  Point,
  Stroke,
  Style,
  TileLayer,
  VectorLayer,
  VectorSource,
  View,
  XYZ
} from '../modules/openlayers.module';


export const INITIAL_CENTER = [-75.0152, -9.1900];
export const INITIAL_ZOOM = 6;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: OlMap;
  private locationSource = new VectorSource(); // Fuente para el marcador de ubicación
  private locationOverlay?: Overlay;

  initMap(target: HTMLElement): OlMap {
    // Fuente de Google Satellite (reutilizada para el OverviewMap)
    const source = new XYZ({
      url: 'https://mt1.google.com/vt/lyrs=s&hl=es&x={x}&y={y}&z={z}'
    });

    // Capa de marcador (Punto azul)
    const locationLayer = new VectorLayer({
      source: this.locationSource,
      zIndex: 100 // Asegura que esté por encima del mapa base
    });

    this.map = new OlMap({
      target: target,
      controls: defaultControls({
        zoom: false, // Deshabilita el control de zoom
      }).extend([
        new OverviewMap({
          layers: [
            new TileLayer({
              source: source
            })
          ],
          collapsed: false,// Aparece expandido por defecto

        })
      ]),
      layers: [
        // Mapa base de Google Satellite (Alta resolución)
        new TileLayer({
          preload: Infinity, // Carga tiles de otros niveles para evitar cuadros vacíos
          properties: { title: 'Satélite (Google)' },
          source: source,
        }),
        locationLayer // Añadimos la capa de ubicación
      ],
      view: new View({
        center: fromLonLat(INITIAL_CENTER), // Centro geográfico de Perú
        zoom: INITIAL_ZOOM, // Encuadre vertical del territorio peruano
      }),
    });
    return this.map;
  }

  /**
   * Actualiza la posición del Overlay de ubicación animado
   * @param lonLat Coordenadas en [longitud, latitud]
   * @param element Elemento HTML que servirá de marcador
   */
  updateUserLocationOverlay(lonLat: number[], element: HTMLElement): void {
    if (!this.locationOverlay) {
      this.locationOverlay = new Overlay({
        element: element,
        positioning: 'center-center',
        stopEvent: false,
      });
      this.map?.addOverlay(this.locationOverlay);
    }
    this.locationOverlay.setPosition(fromLonLat(lonLat));
  }

  destroyMap(): void {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = undefined;
    }
  }
}
