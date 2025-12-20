import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainLoader } from './rain-loader';

describe('RainLoader', () => {
  let component: RainLoader;
  let fixture: ComponentFixture<RainLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RainLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RainLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
