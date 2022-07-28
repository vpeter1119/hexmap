import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexmapComponent } from './hexmap.component';

describe('HexmapComponent', () => {
  let component: HexmapComponent;
  let fixture: ComponentFixture<HexmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HexmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HexmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
