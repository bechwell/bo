import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WformComponent } from './wform.component';

describe('WformComponent', () => {
  let component: WformComponent;
  let fixture: ComponentFixture<WformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
