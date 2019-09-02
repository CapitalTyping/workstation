import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.scss']
})
export class WaitingComponent {
  @Input() size = 70;
  @Input() fullscreen = false;
  @Input() opaque = false;
  @Input() message = '';
}
