import { TestBed } from '@angular/core/testing';

import { WavConverterService } from './wav-converter.service';

describe('WavConverterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WavConverterService = TestBed.get(WavConverterService);
    expect(service).toBeTruthy();
  });
});
