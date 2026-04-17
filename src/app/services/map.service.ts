import { Injectable, signal } from '@angular/core';
import {
  defaultControls,
  fromLonLat,
  OlMap,
  OverviewMap,
  Overlay,
  OverlayPositioning,
  TileLayer,
  View,
  XYZ
} from '../modules/openlayers.module';

/** Coordenadas iniciales del centro del mapa (longitud, latitud) */
export const INITIAL_CENTER = [-75.0152, -9.1900];
/** Nivel de zoom inicial del mapa */
export const INITIAL_ZOOM = 6;
/** URL del servicio de mapas satelitales de Google */
const GOOGLE_SATELLITE_URL = 'https://mt1.google.com/vt/lyrs=s&hl=es&x={x}&y={y}&z={z}';
/** Duración de las animaciones del mapa en milisegundos */
const ANIMATION_DURATION = 1000;
/** Nivel de zoom al que se acerca el mapa al obtener la ubicación del usuario */
const ZOOM_LEVEL_LOCATION = 17;

/**
 * Servicio de Angular para la gestión del mapa OpenLayers.
 * Encapsula toda la lógica relacionada con la inicialización, manipulación
 * y gestión de elementos del mapa, como capas, controles y overlays.
 */
@Injectable({
  providedIn: 'root'
})
export class MapService {
  /** Instancia del mapa OpenLayers */
  private map?: OlMap;
  /** Overlay para mostrar la ubicación actual del usuario */
  private locationOverlay?: Overlay;
  /** Overlay para mostrar un popup con información de la ubicación */
  private popupOverlay?: Overlay;

  /**
   * Signal que indica si el mapa ha sido inicializado y está listo para su uso.
   * @type {Signal<boolean>}
   */
  isReady = signal(false);

  /**
   * Signal que almacena las coordenadas actuales del usuario (longitud, latitud).
   * Es `null` si la ubicación no ha sido obtenida o ha sido limpiada.
   * @type {Signal<{ lon: number, lat: number } | null>}
   */
  userCoords = signal<{ lon: number, lat: number } | null>(null);

  /**
   * Inicializa el mapa OpenLayers en el elemento HTML proporcionado.
   * Configura las capas base, controles y vista inicial.
   * @param {HTMLElement} target El elemento HTML donde se renderizará el mapa.
   * @returns {OlMap} La instancia del mapa OpenLayers inicializado.
   */
  initMap(target: HTMLElement): OlMap {
    // Evita inicializar el mapa si ya existe
    if (this.map) return this.map;

    const satelliteSource = new XYZ({
      url: GOOGLE_SATELLITE_URL,
      crossOrigin: 'anonymous'
    });

    this.map = new OlMap({
      target,
      controls: defaultControls({ zoom: false }).extend([
        new OverviewMap({
          layers: [new TileLayer({ source: satelliteSource })],
          collapsed: false,
        })
      ]),
      layers: [
        new TileLayer({
          source: satelliteSource,
          properties: { title: 'Satélite (Google)' },
          preload: Infinity,
        }),
      ],
      view: new View({
        center: fromLonLat(INITIAL_CENTER),
        zoom: INITIAL_ZOOM,
      }),
    });

    this.isReady.set(true);
    return this.map;
  }

  /**
   * Obtiene un overlay existente o crea uno nuevo si no existe.
   * Añade el overlay al mapa si es nuevo.
   * @private
   * @param {Overlay | undefined} overlayRef La referencia actual del overlay.
   * @param {HTMLElement} element El elemento DOM que se usará como contenido del overlay.
   * @param {{ positioning: OverlayPositioning; offset?: number[]; stopEvent?: boolean }} options Opciones para la creación del overlay.
   * @returns {Overlay} La instancia del overlay.
   */
  private getOrCreateOverlay(
    overlayRef: Overlay | undefined,
    element: HTMLElement,
    options: { positioning: OverlayPositioning; offset?: number[]; stopEvent?: boolean }
  ): Overlay {
    if (overlayRef) return overlayRef;

    const newOverlay = new Overlay({
      element,
      positioning: options.positioning,
      offset: options.offset || [0, 0],
      stopEvent: options.stopEvent ?? false,
    });

    this.map?.addOverlay(newOverlay);
    return newOverlay;
  }

  /**
   * Actualiza la posición del overlay del marcador de usuario.
   * Si el overlay no existe, lo crea.
   * @param {number[]} transformedCoords Coordenadas transformadas para el mapa (ej. en la proyección del mapa).
   * @param {HTMLElement} element El elemento DOM que representa el marcador.
   */
  updateUserLocationOverlay(transformedCoords: number[], element: HTMLElement): void {
    this.locationOverlay = this.getOrCreateOverlay(this.locationOverlay, element, {
      positioning: 'center-center'
    });
    this.locationOverlay.setPosition(transformedCoords);
  }

  /**
   * Muestra un popup en la ubicación especificada.
   * @param {number[]} transformedCoords Coordenadas transformadas para el mapa.
   * @param {HTMLElement} element El elemento DOM que representa el popup.
   */
  showLocationPopup(transformedCoords: number[], element: HTMLElement): void {
    this.popupOverlay = this.getOrCreateOverlay(this.popupOverlay, element, {
      positioning: 'bottom-center',
      stopEvent: true,
      offset: [0, -15]
    });
    this.popupOverlay.setPosition(transformedCoords);
  }

  /**
   * Limpia la ubicación del usuario, oculta los elementos visuales del marcador y popup,
   * y resetea las coordenadas del usuario en el signal `userCoords`.
   * @param {HTMLElement} [markerElement] El elemento DOM del marcador de usuario.
   * @param {HTMLElement} [popupElement] El elemento DOM del popup de ubicación.
   */
  clearUserLocation(): void {
    // Al poner la posición en undefined, OpenLayers oculta automáticamente el elemento
    this.locationOverlay?.setPosition(undefined);
    this.popupOverlay?.setPosition(undefined);

    this.userCoords.set(null);
  }

  /**
   * Obtiene la ubicación geográfica actual del usuario, la muestra en el mapa
   * con un marcador y un popup, y centra el mapa en esa ubicación.
   * @param {HTMLElement} markerElement El elemento DOM que representa el marcador de usuario.
   * @param {HTMLElement} popupElement El elemento DOM que representa el popup de ubicación.
   * @returns {Promise<{ lon: number, lat: number }>} Una promesa que resuelve con las coordenadas (longitud, latitud) del usuario.
   */
  getCurrentLocation(markerElement: HTMLElement, popupElement: HTMLElement): Promise<{ lon: number, lat: number }> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('La geolocalización no está disponible en su navegador.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.longitude, position.coords.latitude];
          const transformedCoords = fromLonLat(coords);
          const result = { lon: position.coords.longitude, lat: position.coords.latitude };

          this.updateUserLocationOverlay(transformedCoords, markerElement);
          this.showLocationPopup(transformedCoords, popupElement);
          this.userCoords.set(result);

          const view = this.map?.getView();
          if (view) {
            view.animate({
              center: transformedCoords,
              zoom: ZOOM_LEVEL_LOCATION,
              duration: ANIMATION_DURATION
            });
          }

          resolve(result);
        },
        reject,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  goHome(): void {
    this.map?.getView()?.animate({
      center: fromLonLat(INITIAL_CENTER),
      zoom: INITIAL_ZOOM,
      duration: ANIMATION_DURATION / 2,
    });
  }

  zoomOut(): void {
    this.adjustZoom(-1);
  }

  zoomIn(): void {
    this.adjustZoom(1);
  }

  private adjustZoom(delta: number): void {
    const view = this.map?.getView();
    const currentZoom = view?.getZoom();
    if (view && currentZoom !== undefined) {
      view.animate({ zoom: currentZoom + delta, duration: 250 });
    }
  }

  destroyMap(): void {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = undefined;
      this.isReady.set(false);
    }
  }
}
