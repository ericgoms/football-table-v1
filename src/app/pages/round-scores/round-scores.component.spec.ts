import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundScoresComponent } from './round-scores.component';

describe('RoundScoresComponent', () => {
  let component: RoundScoresComponent;
  let fixture: ComponentFixture<RoundScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundScoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
