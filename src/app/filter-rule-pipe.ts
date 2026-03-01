import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterRule',
})
export class FilterRulePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
