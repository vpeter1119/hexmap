import { Injectable } from '@angular/core';
import { Marker, Polygon } from 'leaflet';
import { BehaviorSubject } from 'rxjs';

export interface Hex {
  ID?: string,
  coords?: number[],
  properties?: {
    type: string,
    terrain: string
  }
  base?: Polygon
}

export interface Terrain {
  value: string,
  display: string,
  icon: string,
  color: string
}

@Injectable({
  providedIn: 'root'
})
export class HexService {

  selectedHex: Hex;
  selectedHex$: BehaviorSubject<Hex>;
  updatedHex$: BehaviorSubject<Hex>;
  hexMap: any = {};
  mode = 'select';
  mode$: BehaviorSubject<string>;
  terrainPaint: Terrain;
  terrainPaint$: BehaviorSubject<Terrain>;

  terrainTypes = [
    {value: "desert", display: "Desert", icon: " ", color: "#FFF89C"},
    {value: "forest", display: "Forest", icon: "fa fas fa-tree", color: "#2B7A0B"},
    {value: "grassland", display: "Plain", icon: " ", color: "#7DCE13"},
    {value: "hills", display: "Hills", icon: "fa fas fa-mound", color: "#BF9742"},
    {value: "mountain", display: "Mountain", icon: "fa fas fa-mountain", color: "#876445"},
    {value: "water", display: "Sea, Shallow", icon: "fa fas fa-water", color: "#81CACF"},
    {value: "sea", display: "Sea, Deep", icon: "fa fas fa-water", color: "#035397"},
    {value: "settlement", display: "Settlement", icon: "fa fas fa-house", color: "#eee"},
    {value: "swamp", display: "Swamp", icon: "fa fas fa-water", color: "#2B7A0B"},
  ];
  terrainIconMap = {
    "grassland": " ",
    "forest": "fa fas fa-tree",
    "mountain": "fa fas fa-mountain",
    "hills": "fa fas fa-mound",
    "water": "fa fas fa-water"
  };

  constructor() {
    this.selectedHex$ = new BehaviorSubject<Hex>(this.selectedHex);
    this.updatedHex$ = new BehaviorSubject<Hex>(null);
    this.mode$ = new BehaviorSubject<string>('select');
    this.terrainPaint$ = new BehaviorSubject<Terrain>(null);
  }

  getSelectedHex(): Hex {
    return this.selectedHex;
  }

  setSelectedHex(hex: Hex): void {
    console.log('hexService -> setSelectedHex() ', hex);
    this.selectedHex = hex;
    this.selectedHex$.next(this.selectedHex);
  }

  getFillColor(terrain: string, type?: string): string {
    if (type == 'inactive') return '#fefefe';
      var terrainColor = this.terrainTypes.find((t) => t.value == terrain);
      if (terrainColor)
      {
        return terrainColor.color;
      }
      else
      {
        return 'red';
      }
  }

  getTerrainTypes() {
    return this.terrainTypes;
  }

  getHex(id): Hex | undefined {
    if (!id || !this.hexMap[id]) return;
    return this.hexMap[id];
  }

  addHex(hex: Hex) {
    const ID = `${hex.coords[0]}_${hex.coords[1]}`;
    if (!this.hexMap[ID])
    {
      this.hexMap[ID] = hex;
      //console.log('hexMap', this.hexMap);
      //this.saveHexMapLocal();
    }
  }

  updateHex(id: string, properties: Hex['properties']) {
    if (!id || !this.hexMap[id]) return ;
    this.hexMap[id].properties = properties;
    /* if (properties.type != 'inactive') this.hexMap[id].base.setStyle({
      fillOpacity: 1,
      opacity: 1,
    }) */
    console.log('updateHex', this.hexMap[id].base.options.fillOpacity);
    this.updatedHex$.next(this.hexMap[id]);
    //this.saveHexMapLocal();
    return true;
  }

  saveHexMapLocal() {
    console.log('hexMap', this.hexMap);
    var hexMapToSave = [];
    Object.keys(this.hexMap).forEach((key) => {
      const currentItem = this.hexMap[key];
      hexMapToSave.push({
        ID: currentItem.ID,
        coords: currentItem.coords,
        properties: currentItem.properties
      })
    })
    localStorage.setItem('hexMap', JSON.stringify(hexMapToSave));
    console.log('hexMapToSave', hexMapToSave);
  }

  loadHexMapLocal() {
    var hexMapString = localStorage.getItem('hexMap');
    if (hexMapString)
    {
      this.hexMap = JSON.parse(localStorage.getItem('hexMap'));
      return this.hexMap;
    }
  }

  getTerrainIcon(terrain: string) {
    console.log('getTerrainIcon()', terrain);
    const terrainIcon = this.terrainTypes.find((t) => t.value == terrain);
    if (terrainIcon)
    {
      console.log('getTerrainIcon()', terrainIcon.icon);
      return terrainIcon.icon;
    }
    else
    {
      return 'fa fas fa-question'
    }
  }

  setIcon(ID: string, icon: Marker) {
    var currentIcon: Marker = this.hexMap[ID].icon;
    if (currentIcon) currentIcon.remove();
    this.hexMap[ID].icon = icon;
  }

  getMode(): string {
    return this.mode;
  }

  setMode(mode: string) {
    this.mode = mode;
    this.mode$.next(this.mode);
  }

  getTerrainPaint(): Terrain {
    return this.terrainPaint;
  }

  setTerrainPaint(terrain: Terrain) {
    console.warn('setTerrainPaint', terrain)
    this.terrainPaint = terrain;
    this.terrainPaint$.next(this.terrainPaint);
  }

}
