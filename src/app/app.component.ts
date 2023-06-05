import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <app-nav-menu></app-nav-menu>
  <div>{{message}}</div>
  <app-player></app-player>`,
})
export class AppComponent {
  message=''
  value = 'World';
  constructor(private http: HttpClient){
    this.http.get('/api/message').subscribe(
    (resp: any) => this.message = resp.text );
  }
}
