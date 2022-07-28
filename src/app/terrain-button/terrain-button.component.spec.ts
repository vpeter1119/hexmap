import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerrainButtonComponent } from './terrain-button.component';

describe('TerrainButtonComponent', () => {
  let component: TerrainButtonComponent;
  let fixture: ComponentFixture<TerrainButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerrainButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerrainButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
