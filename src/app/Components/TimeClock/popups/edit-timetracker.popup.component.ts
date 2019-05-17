import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DistrictService } from '../../../Service/Manage/district.service';
import { UserSession } from '../../../Services/userSession.service';
import { ReportDetail } from '../../../Model/Report/report.detail';
import { NotifierService } from 'angular-notifier';
import { TimeClock } from 'src/app/Model/timeclock';
import { TimeClockService } from 'src/app/Services/timeClock.service';

@Component({
    selector: 'edit-timetracker',
    templateUrl: 'edit-timetracker.popup.component.html',
    styleUrls: ['edit-timetracker.popup.component.scss']
})
export class EditTimeTracker implements OnInit {
    private notifier: NotifierService;
    msg: string;
    constructor(private dialogRef: MatDialogRef<EditTimeTracker>, private fb: FormBuilder, private timeClockService: TimeClockService,
        @Inject(MAT_DIALOG_DATA) public timeTracker: TimeClock, notifier: NotifierService,
        private districtService: DistrictService, private userSession: UserSession) {
        this.notifier = notifier;
    }

    onCloseDialog() {
        this.dialogRef.close();
    }

    ngOnInit() {
    }

    onUpdateTimeTracker(timeTrackerDetail: TimeClock) {
        let TimeModel = {
            clockInDate: timeTrackerDetail.clockInDate,
            clockInTime:timeTrackerDetail.startTime,
            clockOutTime:timeTrackerDetail.endTime,
            userId:timeTrackerDetail.userId,
            timeClockId:timeTrackerDetail.timeClockId
            
        }
        this.timeClockService.Patch('/Time/updateTimeClockData/', TimeModel).subscribe((respose: any) => {
            if (respose == "success") {
                this.dialogRef.close('Reload');
                this.notifier.notify('success', 'Updated Successfully');
            }
            else {
                this.notifier.notify('error', 'Please select different date or time.');
            }
        });
    }
}