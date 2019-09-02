import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuVideoComponent } from './menu-video.component';

describe('MenuVideoComponent', () => {
  let component: MenuVideoComponent;
  let fixture: ComponentFixture<MenuVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
