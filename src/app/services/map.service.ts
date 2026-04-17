import { Injectable, inject } from '@angular/core';
import {
  defaultControls,
  fromLonLat,
  OlMap,
  OverviewMap,
  TileLayer,
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

  initMap(target: HTMLElement): OlMap {
    // Fuente de Google Satellite (reutilizada para el OverviewMap)
    const source = new XYZ({
      url: 'https://mt1.google.com/vt/lyrs=s&hl=es&x={x}&y={y}&z={z}'
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
      ],
      view: new View({
        center: fromLonLat(INITIAL_CENTER), // Centro geográfico de Perú
        zoom: INITIAL_ZOOM, // Encuadre vertical del territorio peruano
      }),
    });
    return this.map;
  }

  destroyMap(): void {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = undefined;
    }
  }
}
