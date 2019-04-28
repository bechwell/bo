import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoappComponent } from './autoapp.component';

describe('AutoappComponent', () => {
  let component: AutoappComponent;
  let fixture: ComponentFixture<AutoappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
