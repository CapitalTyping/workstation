import { TestBed } from '@angular/core/testing';

import { ContentHelper } from './content.helper';

describe('ContentHelper', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentHelper = TestBed.get(ContentHelper);
    expect(service).toBeTruthy();
  });
});
