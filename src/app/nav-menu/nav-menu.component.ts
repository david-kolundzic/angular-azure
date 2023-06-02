import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudService } from '../_services/cloud.service';
// import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  model: any = {};
  
  //currentUser$ = this.accountService.currentUser$;

  constructor( private router: Router, private cloudService:CloudService) {}
  
  ngOnInit(): void {
    this.getTest();
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  login() {
    
  }

  logout() {
   
  }
  getTest() {
    this.cloudService.getTest().subscribe({
      next: response => {
        console.log("DOHVACEN TEST: ", JSON.stringify(response))
      },
      error: err=> console.log("ERROR TEST", err)
    });
  }
}
