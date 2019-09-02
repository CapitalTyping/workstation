import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-notes',
  templateUrl: './menu-notes.component.html',
  styleUrls: ['./menu-notes.component.scss']
})
export class MenuNotesComponent implements OnInit {
  notes = [
    {
      title: 'review john workM',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i' +
          'ncididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
          'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      title: 'review john workM',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i' +
          'ncididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
          'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      title: 'review john workM',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i' +
          'ncididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
          'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      title: 'review john workM',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i' +
          'ncididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
          'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
