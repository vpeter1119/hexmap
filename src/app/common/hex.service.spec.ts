import { TestBed } from '@angular/core/testing';

import { HexService } from './hex.service';

describe('HexService', () => {
  let service: HexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
