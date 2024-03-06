import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RESONANCE20Component } from './RESONANCE20Component';

describe('RESONANCE20Component', () => {
  let component: RESONANCE20Component;
  let fixture: ComponentFixture<RESONANCE20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RESONANCE20Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RESONANCE20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
