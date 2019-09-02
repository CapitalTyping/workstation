import { Component, OnInit } from '@angular/core';

import { TaskService } from '@services/task/task.service';
import { ConfigService } from '@services/config/config.service';

@Component({
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss']
})
export class ContentWrapperComponent implements OnInit {
  acts = {
    isLoading: true,
    isSidenavActive: false,
    isSending: false,
  };

  constructor(
      private taskSvc: TaskService,
      private configSvc: ConfigService,
  ) {}

  ngOnInit(): void {
    this.taskSvc.getTaskDetails().subscribe(
        () => this.acts.isLoading = false,
        () => this.acts.isLoading = false
    );
    this.configSvc.getConfig().subscribe();
  }

  onToggleSidenav(isActive: boolean) {
    this.acts.isSidenavActive = isActive;
  }
}
