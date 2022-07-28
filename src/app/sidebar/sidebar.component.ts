import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { HexService, Hex, Terrain } from '../common/hex.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  selectedHex?: Hex | null;
  formData: any;
  terrainTypes: Terrain[] = [];
  mode = 'select';
  selectedTerrainType: Terrain;

  constructor(
    private hexService: HexService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.terrainTypes = this.hexService.getTerrainTypes();
    //this.cdr.detectChanges();
    this.hexService.mode$.subscribe((mode) => {
      this.mode = mode;
    })
  }

  ngOnInit(): void {
    this.terrainTypes = this.hexService.getTerrainTypes();
    console.log(this.terrainTypes);
    //this.selectedHex = this.hexService.getSelectedHex();
    this.hexService.selectedHex$.subscribe((hex) => {
      this.ngZone.run(() => {
        if (hex) this.selectedHex = Object.assign({}, hex);
        this.formData = Object.assign({}, this.selectedHex);
      })
    });
  }

  onSubmit(): void {
    var input = Object.assign({}, this.selectedHex);
    const ID = `${input.coords[0]}_${input.coords[1]}`;
    if (input.properties.terrain)
    {
      input.properties.type = 'active';
      this.hexService.updateHex(ID, input.properties);
    }
  }

  selectTerrainType(terrain: Terrain) {
    this.selectedTerrainType = terrain;
    this.hexService.setTerrainPaint(terrain);
  }

}
