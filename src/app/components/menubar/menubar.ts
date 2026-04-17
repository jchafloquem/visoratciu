import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menubar.html',
  styleUrl: './menubar.css',
})
export class Menubar {
  LogoutClick(){}
}
