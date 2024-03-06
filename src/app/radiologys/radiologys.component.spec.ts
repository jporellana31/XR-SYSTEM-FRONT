import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologysComponent } from './radiologys.component';

describe('RadiologysComponent', () => {
  let component: RadiologysComponent;
  let fixture: ComponentFixture<RadiologysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadiologysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadiologysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
