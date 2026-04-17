import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoserverService {
  private http = inject(HttpClient);

  // Rutas base del GeoServer (basadas en tu información)
  private readonly BASE_URL = 'https://geoserver.ue003cofopri.gob.pe/geoserver/rest';

  // Credenciales proporcionadas
  private readonly USER = 'admin';
  private readonly PASS = 'Cofopri$Ue003-+-';

  /**
   * Crea los headers necesarios para la autenticación básica y solicita JSON
   */
  private getHeaders(): HttpHeaders {
    // Codificamos las credenciales en Base64 para Basic Auth
    const auth = btoa(`${this.USER}:${this.PASS}`);
    return new HttpHeaders({
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    });
  }

  /**
   * Obtiene la lista de todos los workspaces
   * Nota: Usamos .json en la URL para obtener un objeto manipulable directamente
   */
  getWorkspaces(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/workspaces.json`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtiene la lista de todas las capas (layers)
   */
  getLayers(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/layers.json`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtiene la lista de capas filtradas por un workspace específico
   */
  getLayersByWorkspace(workspace: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/workspaces/${workspace}/layers.json`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtiene información detallada de una capa específica
   */
  getLayerDetails(layerName: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/layers/${layerName}.json`, {
      headers: this.getHeaders()
    });
  }
}
