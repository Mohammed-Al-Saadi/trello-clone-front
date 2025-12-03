import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingField } from './floating-field';

describe('FloatingField', () => {
  let component: FloatingField;
  let fixture: ComponentFixture<FloatingField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
