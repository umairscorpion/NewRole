import { Injectable, Output, EventEmitter } from '@angular/core'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class CommunicationService {
    isOpen = false;
    @Output() AbsenceDetail: EventEmitter<boolean> = new EventEmitter();
    @Output() updateLeftSidePanel: EventEmitter<boolean> = new EventEmitter();

    ViewAbsenceDetail(AbsenceDetail: any) {
        this.AbsenceDetail.emit(AbsenceDetail);
    }

    UpdatePanel(config: any) {
        this.updateLeftSidePanel.emit(config);
    }
}