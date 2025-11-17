import { TestBed } from '@angular/core/testing';

import { GetRoles } from './get-roles';

describe('GetRoles', () => {
  let service: GetRoles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetRoles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
