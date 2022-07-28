import { Component, NgZone, OnInit } from '@angular/core';
import { circle, CRS, divIcon, FeatureGroup, latLng, Map, map, Marker, Point, point, Polygon, polygon, PolylineOptions, Projection, tileLayer, Transformation, Util } from 'leaflet';
import { Hex, HexService, Terrain } from '../common/hex.service';

@Component({
  selector: 'app-hexmap',
  templateUrl: './hexmap.component.html',
  styleUrls: ['./hexmap.component.scss']
})
export class HexmapComponent implements OnInit {

  mode = 'select';
  terrainPaint: Terrain;

  //hexMap: any = {};
  mapObject: Map;

  layers = [];
  hexes: FeatureGroup = new FeatureGroup();
  icons: FeatureGroup = new FeatureGroup();

  hexRadius = 4; //pixels

  options = {
    layers: [
      //tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 3,
    maxZoom: 4,
    minZoom: 1,
    center: latLng(0, 0),
    crs: CRS.Simple
  };

  constructor(
    private hexService: HexService,
    private ngZone: NgZone
  ) {
    this.hexService.updatedHex$.subscribe((hex) => {
      if (hex)
      {
        this.ngZone.run(() => {
          console.warn(hex.base.options.fillOpacity);
          //hex.base.options.fillOpacity = 1;
          //hex.base.options.opacity = 1;
          hex.base.setStyle({
            fillColor: this.hexService.getFillColor(hex.properties.terrain, hex.properties.type),
            fillOpacity: hex.properties.type == 'inactive' ? 0.2 : 1,
            opacity: hex.properties.type == 'inactive' ? 0.2 : 1,
          })
          console.warn(hex.base.options.fillOpacity);
          if (hex.properties.type != 'inactive') this.createIconMarker(hex);
          this.addNeighbors(hex.coords);
          //this.hexes.getLayers()[this.hexes.getLayers().length-1];
        })
      }
    })
    this.hexService.mode$.subscribe((mode) => {
      this.mode = mode;
    });
    this.hexService.terrainPaint$.subscribe((terrain) => {
      this.terrainPaint = terrain;
    })
  }

  ngOnInit(): void {
    var hexMap = this.hexService.loadHexMapLocal();
    //var hexMap = false;
    if (hexMap)
    {
      console.warn('HexMap loaded from local storage');
      //var hexes = Object.keys(hexMap).map((key) => hexMap[key]);
      hexMap.forEach((h) => {
        this.createHex(h.coords, h.properties);
        if (h.properties.type != 'inactive') this.createIconMarker(h);
      })
      hexMap.forEach((h) => {
        if (h.properties.type != 'inactive') this.addNeighbors(h.coords);
      })
      console.warn(this.icons)
    }
    else
    {
      console.warn('HexMap initiated from zero');
      this.initiateHexMap();
    }
  }

  onMapReady(map: L.Map) {
    this.mapObject = map;
    this.mapObject.addLayer(this.hexes);
    this.mapObject.addLayer(this.icons);
    /* this.mapObject.on('contextmenu', <LeafletMouseEvent>(e) => {
      this.openContextPopup(e);
    }); */
    this.mapObject.on('zoomend', () => {
      var currentZoom = this.mapObject.getZoom();
      if (currentZoom < 3) this.mapObject.removeLayer(this.icons);
      else if (currentZoom >= 3 && !this.mapObject.hasLayer(this.icons)) this.mapObject.addLayer(this.icons);
    })
  }

  createHex(coords: number[], options: any = {}): boolean {
    console.log('createHex ', coords, options);
    const ID = `${coords[0]}_${coords[1]}`;
    //if (this.hexMap[ID]) return false;
    if (this.hexService.getHex(ID)) return;
    const radius = this.hexRadius;
    const b = this.getSquaredDist(radius);
    const center = [
      coords[1] % 2 == 0 ? coords[0]*b*2 : (coords[0]+0.5)*b*2,
      coords[1]*(radius*1.5)
    ];
    const hexOptions: PolylineOptions = {
      color: options.borderColor || '#333',
      weight: 1,
      opacity: options.type == 'inactive' ? 0.2 : 1,
      fill: true,
      fillOpacity: options.type == 'inactive' ? 0.2 : 1,
      fillColor: this.hexService.getFillColor(options.terrain || '', options.type)
    }
    const hex = polygon([
      [ center[0], center[1] + radius ], //A
      [ center[0] + b, center[1] + radius/2 ], //B
      [ center[0] + b, center[1] - radius/2 ], //C
      [ center[0], center[1] - radius ], //D
      [ center[0] - b, center[1] - radius/2 ], //E
      [ center[0] - b, center[1] + radius/2 ], //F
    ], hexOptions)
    hex.on('click', () => {
      if (this.mode == 'select')
      {
        this.hexService.setSelectedHex({coords, properties: options, base: hex})
      }
      else if (this.mode == 'paint')
      {
        this.hexService.updateHex(ID, Object.assign({}, {type: 'active', terrain: this.terrainPaint.value}))
      }
    });
    hex.on('mouseover', () => {
      if (this.mode == 'select' && options.type == 'inactive') hex.setStyle({opacity: 0.6,fillOpacity: 0.6});
    })
    hex.on('mouseout', () => {
      if (this.mode == 'select' && options.type == 'inactive') hex.setStyle({opacity: 0.2,fillOpacity: 0.2});
    })
    //this.hexMap[ID] = hex;
    this.hexService.addHex({ID, coords, properties: options, base: hex})
    this.hexes.addLayer(hex);
    //this.hexes.push(hex);
    console.log(this.layers.length);
    return true;
  }

  getSquaredDist(x: number) {
    return (Math.sqrt(3)*x)/2;
  }

  getCenter(coords: number[], radius) {
    const b = this.getSquaredDist(radius);
    const center = [
      coords[1] % 2 == 0 ? coords[0]*b*2 : (coords[0]+0.5)*b*2,
      coords[1]*(radius*1.5)
    ];
    return center;
  }

  initiateHexMap(): void {
    var coords = [0, 0]
    // Center    
    this.createHex(coords, { type: 'active', terrain: 'grassland' })
    this.addNeighbors(coords);
  }

  addNeighbors(coords: number[]) {
    console.log('addNeighbors ', coords);
    if (coords[0] % 2 == 0 && coords[1] % 2 == 0 || coords[0] % 2 != 0 && coords[1] % 2 == 0)
    {
      // Above
      var above = this.createHex([coords[0]+1, coords[1]], { type: 'inactive' });
      // Upper right
      var upperRight = this.createHex([coords[0], coords[1]+1], { type: 'inactive' });
      // Lower right
      var lowerRight = this.createHex([coords[0]-1, coords[1]+1], { type: 'inactive' });
      // Below
      var below = this.createHex([coords[0]-1, coords[1]], { type: 'inactive' });
      // Lower left
      var lowerLeft = this.createHex([coords[0]-1, coords[1]-1], { type: 'inactive' });
      // Upper left
      var upperLeft = this.createHex([coords[0], coords[1]-1], { type: 'inactive' });
    }
    else
    {
      // Above
      var above = this.createHex([coords[0]+1, coords[1]], { type: 'inactive' });
      // Upper right
      var upperRight = this.createHex([coords[0]+1, coords[1]+1], { type: 'inactive' });
      // Lower right
      var lowerRight = this.createHex([coords[0], coords[1]+1], { type: 'inactive' });
      // Below
      var below = this.createHex([coords[0]-1, coords[1]], { type: 'inactive' });
      // Lower left
      var lowerLeft = this.createHex([coords[0], coords[1]-1], { type: 'inactive' });
      // Upper left
      var upperLeft = this.createHex([coords[0]+1, coords[1]-1], { type: 'inactive' });
    }
    console.log({
      1: above, 
      2: upperRight, 
      3: lowerRight, 
      4: below, 
      5: lowerLeft, 
      6: upperLeft
    });
    //console.log(this.hexMap);
  }

  createIconMarker(hex: Hex) {
    let iconName = this.hexService.getTerrainIcon(hex.properties.terrain);
    let imageName = hex.properties.terrain + '.png';
    let icon = divIcon({
      html: ['mountain', 'settlement', 'forest', 'hills', 'water', 'settlement'].includes(hex.properties.terrain) ? `<div class="hex-icon-container" style="width: 100%; height: 100%; display: flex;"><img style="height: 40px; width: 40px; margin: auto" src="assets/images/mapicons/${imageName}" /></div>` : `<div class="hex-icon-container" style="width: 100%; height: 100%; display: flex;"><i class="${iconName} fa-2xl" style="margin: auto"></i></div>`,
      className: 'custom-map-marker-container',
      iconSize: [60, 60],
      iconAnchor: [30, 30]
    });
    const center = this.getCenter(hex.coords, this.hexRadius);
    let marker = new Marker(latLng(center[0], center[1]), {
      icon: icon
    });
    this.icons.addLayer(marker);
    marker.on('click', () => {
      if (this.mode == 'select')
      {
        this.hexService.setSelectedHex(hex)
      }
      else if (this.mode == 'paint')
      {
        this.hexService.updateHex(hex.ID, Object.assign({}, {type: 'active', terrain: this.terrainPaint.value}))
      }
    });
    this.hexService.setIcon(hex.ID, marker);
    return marker;
  }

}
