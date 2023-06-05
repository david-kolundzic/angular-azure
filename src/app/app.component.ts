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
    this.http.get('/api/message?name=david').subscribe({
      next: (resp: any) => {
      console.log(resp)
      this.message = resp.toString();
    } });
  }
}
