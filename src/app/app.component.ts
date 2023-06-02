import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <app-nav-menu></app-nav-menu>
  <app-player></app-player>`,
})
export class AppComponent {
  value = 'World';
}
