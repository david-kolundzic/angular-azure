import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <app-nav-menu></app-nav-menu>
  <div>{{message}}</div>
  <div></div>
  <app-player></app-player>`,
})
export class AppComponent {
  message='';
  messageHello='';
  value = 'World';
  constructor(private http: HttpClient){}

  ngOnInit(): void {

    this.http.get('/api/message?name=david', { responseType:'text' }).subscribe({
      next: (resp: any) => {
        console.log("PORUKA");
        console.log(resp)
        this.message = resp.toString();
      } 
    });

    this.http.get('/api/messageHello', { responseType: 'json' }).subscribe({
      next: (resp: any) => {
        console.log("PORUKA HELLO");
        console.log(resp)
        this.messageHello = resp.toString();
      } 
    });

  }
}
