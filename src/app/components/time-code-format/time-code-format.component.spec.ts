import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeCodeFormatComponent } from './time-code-format.component';

describe('TimeCodeFormatComponent', () => {
  let component: TimeCodeFormatComponent;
  let fixture: ComponentFixture<TimeCodeFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeCodeFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeCodeFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
