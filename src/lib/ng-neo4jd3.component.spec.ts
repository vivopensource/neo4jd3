import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgNeo4jd3Component } from './ng-neo4jd3.component';

describe('NgNeo4jd3Component', () => {
  let component: NgNeo4jd3Component;
  let fixture: ComponentFixture<NgNeo4jd3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgNeo4jd3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgNeo4jd3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
