import { TestBed } from '@angular/core/testing';

import { FontAwesomeService } from './font-awesome.service';

describe('FontAwesomeService', () => {
  let service: FontAwesomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontAwesomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
