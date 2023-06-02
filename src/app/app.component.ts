import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div>Hello {{value}}, </div> <div>test publish na Azure static web app</div>`,
})
export class AppComponent {
  value = 'World';
}
