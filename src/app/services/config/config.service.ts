import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@services/api/api.service';
import { tap } from 'rxjs/operators';
import { TagsService } from '@services/tags/tags.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
      private apiSvc: ApiService,
      private tagSvc: TagsService,
  ) { }

  getConfig(): Observable<any> {
    return this.apiSvc.get('/config').pipe(
        tap(config => this.tagSvc.fetchTags(config.inputTemplate.tags))
    );
  }
}
