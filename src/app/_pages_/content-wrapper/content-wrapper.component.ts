import { Component, OnInit } from '@angular/core';

import { TaskService } from '@services/task/task.service';
import { ConfigService } from '@services/config/config.service';
import { TagsService } from '@tran/services/tags/tags.service';
import { Router, ActivatedRoute } from '@angular/router';

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
    private router: Router,
    private route: ActivatedRoute
    // private route: ActivatedRouteSnapshot
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams.session_token;
    console.log('aaa', this.route);
    if (!token) {
      this.router.navigate(['/forbidden']);
    }
    this.taskSvc.getTaskDetails(token).subscribe(
      res => {
        console.log(res);
        // res.task.media.map((item: any) => {
        //   item.params.response.results.map(ritem => {
        //     ritem
        //   })
        // })

      },
      err => {
        if (err.status === 401) {
          this.router.navigate(['/forbidden']);
        }
      },
      () => {
        this.acts.isLoading = false;
      },

    );
  }

  onToggleSidenav(isActive: boolean) {
    this.acts.isSidenavActive = isActive;
  }
}
