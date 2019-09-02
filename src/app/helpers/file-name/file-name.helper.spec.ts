import { TestBed } from '@angular/core/testing';

import { FileNameHelper } from './file-name.helper';

describe('FileNameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileNameHelper = TestBed.get(FileNameHelper);
    expect(service).toBeTruthy();
  });
});
