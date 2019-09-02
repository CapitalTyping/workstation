import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPlaylistComponent } from './menu-playlist.component';

describe('MenuPlaylistComponent', () => {
  let component: MenuPlaylistComponent;
  let fixture: ComponentFixture<MenuPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
