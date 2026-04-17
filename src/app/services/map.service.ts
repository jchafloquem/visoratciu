import { Injectable, inject } from '@angular/core';
import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { defaults as defaultControls } from 'ol/control';
import { fromLonLat } from 'ol/proj';


@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: OlMap;

  initMap(target: HTMLElement): OlMap {
    this.map = new OlMap({
      target: target,
      controls: defaultControls({
        zoom: false, // Deshabilita el control de zoom
      }),
      layers: [
        // Mapa base de Google Satellite (Alta resolución)
        new TileLayer({
          properties: { title: 'Satélite (Google)' },
          source: new XYZ({
            url: 'https://mt1.google.com/vt/lyrs=s&hl=es&x={x}&y={y}&z={z}'
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([-75.0152, -9.1900]), // Centro geográfico de Perú
        zoom: 6, // Encuadre vertical del territorio peruano
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
