import { TestBed } from '@angular/core/testing';

import { SecurityRule } from './security-rule';

describe('SecurityRule', () => {
  let service: SecurityRule;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
