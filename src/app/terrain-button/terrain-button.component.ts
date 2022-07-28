import { Component, Input, OnInit } from '@angular/core';
import { HexService, Terrain } from '../common/hex.service';

@Component({
  selector: 'app-terrain-button',
  templateUrl: './terrain-button.component.html',
  styleUrls: ['./terrain-button.component.scss']
})
export class TerrainButtonComponent implements OnInit {

  @Input() terrain: Terrain;

  terrainIcon;
  terrainImage;
  useImage = false;

  constructor(
    private hexService: HexService
  ) {
  }

  ngOnInit(): void {
    this.terrainIcon = this.hexService.getTerrainIcon(this.terrain.value);
    this.terrainImage = this.terrain.value + '.png';
    if (['forest', 'hills', 'mountain', 'settlement', 'water'].includes(this.terrain.value)) this.useImage = true;
  }

}
