import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[] = [];


  cargarMenu() {
    console.log(localStorage.getItem('menu'));
    const menuFromLocalStorage = localStorage.getItem('menu');
    this.menu = menuFromLocalStorage ? JSON.parse(menuFromLocalStorage) : [];
  }
  

  constructor() { }
}
