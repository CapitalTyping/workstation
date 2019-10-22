import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '@tran/services/task/task.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-menu-notes',
  templateUrl: './menu-notes.component.html',
  styleUrls: ['./menu-notes.component.scss']
})
export class MenuNotesComponent implements OnInit, OnDestroy {
  task: any;
  constructor(private taskSvc: TaskService) {
    this.taskSvc.$task.pipe(untilDestroyed(this)).subscribe(task => this.task = task);
  }

  ngOnInit() {
  }

  nl2br(str, is_xhtml = false) {
    if (typeof str === 'undefined' || str === null) {
      return '';
    }
    const breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  }

  ngOnDestroy() {

  }

}
