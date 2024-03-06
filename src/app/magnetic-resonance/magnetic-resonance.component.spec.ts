import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagneticResonanceComponent } from './magnetic-resonance.component';

describe('MagneticResonanceComponent', () => {
  let component: MagneticResonanceComponent;
  let fixture: ComponentFixture<MagneticResonanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MagneticResonanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagneticResonanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
