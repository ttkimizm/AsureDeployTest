import { TestBed } from '@angular/core/testing';

import { CommonLogicService } from './common-logic.service';

describe('CommonLogicService', () => {
  let service: CommonLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
