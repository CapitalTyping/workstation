import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNotesComponent } from './menu-notes.component';

describe('MenuNotesComponent', () => {
  let component: MenuNotesComponent;
  let fixture: ComponentFixture<MenuNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
