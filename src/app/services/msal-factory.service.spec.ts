import { TestBed } from '@angular/core/testing';

import { MsalFactoryService } from './msal-factory.service';

describe('MsalFactoryService', () => {
  let service: MsalFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsalFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
