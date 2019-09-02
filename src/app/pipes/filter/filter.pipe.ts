import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  public transform<T, P extends keyof T>(arr: T[], props: P[], searchText: string) {
    if (!searchText) return arr;
    return (arr || []).filter((item: T) => {
      return props.some((propName: P) => {
        if (item.hasOwnProperty(propName)) {
          return new RegExp(searchText, 'gi').test(item[propName as string]);
        } else {
          console.warn('FILTER will always skip, because of no property "' + propName + '"');
        }
      });
    });
  }
}

