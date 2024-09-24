import { TestBed } from '@angular/core/testing';

import { RegisterRequestService } from './register-request.service';

describe('RegisterRequestService', () => {
  let service: RegisterRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
