import { TestBed } from '@angular/core/testing';

import { AudioConverterService } from './audio-converter.service';

describe('AudioConverterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AudioConverterService = TestBed.get(AudioConverterService);
    expect(service).toBeTruthy();
  });
});
