import { TestBed } from '@angular/core/testing';

import { GsService } from './gs.service';

describe('GsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GsService = TestBed.get(GsService);
    expect(service).toBeTruthy();
  });
});
