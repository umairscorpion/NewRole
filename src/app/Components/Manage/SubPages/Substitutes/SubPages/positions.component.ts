import { Component, ViewChild, OnInit} from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { IDistrict } from '../../../../../Model/Manage/district';
import { DistrictService } from '../../../../../Service/Manage/district.service';
import { UserSession } from '../../../../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PositionComponent } from './popups/position-detail.popup.component';
import swal from 'sweetalert2';

@Component({
    selector: 'position-table',
    templateUrl: 'positions.component.html',
    styleUrls: ['positions.component.scss']
})
export class PositionsComponent implements OnInit {
    displayedColumns = ['Title', 'Visibility', 'action'];
    SubstituteDetail: any;
    private notifier: NotifierService;
    District: IDistrict;
    positions: any;
    weeklyLimitSettings: FormGroup;
    positionsDataSource = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    Employees: any
    msg: string;

    constructor(
        private _districtService: DistrictService, 
        public dialog: MatDialog,
        notifier: NotifierService,
        public sanitizer: DomSanitizer, 
        private _userSession: UserSession, 
        private fb: FormBuilder) {
            this.notifier = notifier;
        }

    ngOnInit(): void {
        this.intializeForms();
        this.getpositions();
    }

    ngAfterViewInit() {
        this.positionsDataSource.sort = this.sort;
        this.positionsDataSource.paginator = this.paginator;
    }

    intializeForms() {
        this.weeklyLimitSettings = this.fb.group({
            WeeklyHourLimit: [{ value: '', disabled: true }],
            IsWeeklyLimitApplicable: [{ value: false, disabled: true }]
        });
    }

    getpositions(): void {
        let DistrictId = this._userSession.getUserDistrictId();
        this._districtService.getById('user/positions', DistrictId).subscribe((data: any) => {
            this.positionsDataSource.data = data; 
        },
            error => this.msg = <any>error);
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.positionsDataSource.filter = filterValue;
    }

    onOpenPositionPopup() {
        const dialogRef = this.dialog.open(PositionComponent, {
            panelClass: 'position-details-dialog'
        }); 
        dialogRef.afterClosed().subscribe(result => {
            this.getpositions();
        });
    }

    editPosition(position: any) {
        const dialogRef = this.dialog.open(PositionComponent, {
            data: position,
            panelClass: 'position-details-dialog'
        }); 
        dialogRef.afterClosed().subscribe(result => {
            this.getpositions();
        });
    }

    // deletePosition(id: number): void {
    //     var confirmResult = confirm('Are you sure you want to delete position?');
    //     if (confirmResult) {
    //         this._districtService.delete('user/deletePosition/', id).subscribe((response: any) => {
    //                 this.notifier.notify('success', 'Deleted Successfully');
    //                 this.getpositions();
    //         });
    //     }
    // }

    deletePosition(id: number): void {
    
        swal.fire({
            title: 'Delete',
            text:
                'Are you sure you want to delete position?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-success',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: false
        }).then(r => {
            if (r.value) {
                this._districtService.delete('user/deletePosition/', id).subscribe((response: any) => {
                    this.notifier.notify('success', 'Deleted Successfully');
                    this.getpositions();
              },
                error => this.msg = <any>error);
            }
        });
    }

}

