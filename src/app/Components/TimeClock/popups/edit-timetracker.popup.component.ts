import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { TimeClock } from '../../../Model/timeclock';
import { TimeClockService } from '../../../Services/timeClock.service';

@Component({
    selector: 'edit-timetracker',
    templateUrl: 'edit-timetracker.popup.component.html',
    styleUrls: ['edit-timetracker.popup.component.scss']
})
export class EditTimeTracker implements OnInit {
    private notifier: NotifierService;
    msg: string;

    constructor(
        private dialogRef: MatDialogRef<EditTimeTracker>,
        private timeClockService: TimeClockService,
        @Inject(MAT_DIALOG_DATA) public timeTracker: TimeClock,
        notifier: NotifierService) {
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
            clockInTime: timeTrackerDetail.startTime,
            clockOutTime: timeTrackerDetail.endTime,
            userId: timeTrackerDetail.userId,
            timeClockId: timeTrackerDetail.timeClockId

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