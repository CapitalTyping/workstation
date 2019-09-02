import { TestBed } from '@angular/core/testing';

import { HotKeysHelper } from './hot-keys.helper';

describe('HotKeysService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HotKeysHelper = TestBed.get(HotKeysHelper);
    expect(service).toBeTruthy();
  });
});
