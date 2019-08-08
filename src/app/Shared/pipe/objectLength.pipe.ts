import { Pipe, PipeTransform } from '@angular/core';
import { SubstituteList } from '../../Model/SubstituteList';
@Pipe({ name: 'objectLength' })
export class objectLengthPipe implements PipeTransform {
    transform(sublist: SubstituteList[]): any {
        return `${sublist.filter(list => list.isAdded == true).length}`
    }
}