import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuShortcutsComponent } from './menu-shortcuts.component';

describe('MenuShortcutsComponent', () => {
  let component: MenuShortcutsComponent;
  let fixture: ComponentFixture<MenuShortcutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuShortcutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuShortcutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
