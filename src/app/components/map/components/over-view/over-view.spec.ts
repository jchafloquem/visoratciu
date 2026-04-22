import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverViewComponent } from './over-view';

describe('OverView', () => {
  let component: OverViewComponent;
  let fixture: ComponentFixture<OverViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
