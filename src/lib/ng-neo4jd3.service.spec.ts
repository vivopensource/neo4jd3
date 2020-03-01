import { TestBed } from '@angular/core/testing';

import { NgNeo4jd3Service } from './ng-neo4jd3.service';

describe('NgNeo4jd3Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgNeo4jd3Service = TestBed.get(NgNeo4jd3Service);
    expect(service).toBeTruthy();
  });
});
