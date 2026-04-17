import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isExpanded = true;

  // Mock de ítems de navegación
  menuItems = [
    { id: 'search', icon: 'bi bi-search', label: 'Buscar', active: false },
    { id: 'layers', icon: 'bi bi-layers', label: 'Capas', active: true },
    { id: 'legend', icon: 'bi bi-map', label: 'Leyenda', active: false },
    { id: 'print', icon: 'bi bi-printer', label: 'Imprimir', active: false },
    { id: 'accessibility', icon: 'bi bi-universal-access', label: 'Accesibilidad', active: false },
    { id: 'settings', icon: 'bi bi-gear', label: 'Configuración', active: false },
    { id: 'info', icon: 'bi bi-info-circle', label: 'Acerca', active: false }
  ];

  // Mock de capas estáticas para la réplica visual
  mockLayers = [
    { name: 'Lotes Urbanos', visible: true, opacity: 100 },
    { name: 'Manzanas Catastrales', visible: true, opacity: 80 },
    { name: 'Vías y Accesos', visible: false, opacity: 100 },
    { name: 'Límites Distritales', visible: true, opacity: 50 }
  ];

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  setActive(item: any) {
    this.menuItems.forEach(i => i.active = (i === item));
    this.isExpanded = true;
  }
}
