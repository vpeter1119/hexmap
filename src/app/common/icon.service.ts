import { Injectable } from '@angular/core';
import { faTree } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  icons = {
    tree: faTree
  }

  constructor() { }

  getIcons() {
    return this.icons;
  }
}
