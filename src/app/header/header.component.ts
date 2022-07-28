import { Component, NgZone, OnInit } from '@angular/core';
import { HexService } from '../common/hex.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  mode;

  constructor(
    private ngZone: NgZone,
    private hexService: HexService
  ) {
    this.hexService.mode$.subscribe((mode) => {
      this.ngZone.run(() => {
        this.mode = mode;
      })
    })
  }

  ngOnInit(): void {
  }

  onSaveToLocal() {
    this.hexService.saveHexMapLocal();
  }

  onClearLocal() {
    localStorage.removeItem('hexMap');
    location.reload();
  }

  selectMode(mode) {
    this.mode = mode;
    this.hexService.setMode(mode);
  }

}
