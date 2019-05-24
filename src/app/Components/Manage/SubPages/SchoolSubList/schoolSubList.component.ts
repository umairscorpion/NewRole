import { Component, OnInit, ViewChild } from '@angular/core';
import { DataContext } from '../../../../Services/dataContext.service';
import { EmployeeService } from '../../../../Service/Manage/employees.service';
import { UserSession } from '../../../../Services/userSession.service';
import { SchoolSubList } from '../../../../Model/SchoolSubList';
import { MatSelectionList } from '@angular/material';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'school-sub-list',
    templateUrl: 'schoolSubList.component.html',
    styleUrls: ['schoolSubList.component.scss']
})

export class SchoolSubListComponent implements OnInit {
    @ViewChild('subzz') selectionlist: MatSelectionList;
    @ViewChild('blockedsubzz') blockedselectionlist: MatSelectionList;
    showBlockedSubstitutes: boolean;
    showSubstitutes: boolean
    private notifier: NotifierService;
    msg: string;
    schoolSubList: SchoolSubList[] = Array<SchoolSubList>();
    selectedSchoolSubList: SchoolSubList[] = Array<SchoolSubList>();
    blockedSchoolSubList: SchoolSubList[] = Array<SchoolSubList>();
    selectedBlockedSchoolSubList: SchoolSubList[] = Array<SchoolSubList>();
    constructor(private _employeeService: EmployeeService, private userSession: UserSession,
        private dataContext: DataContext, notifier: NotifierService) { this.notifier = notifier; }

    ngOnInit(): void {
        this.getSustitutes();
        this.getBlockedSustitutes();
    }

    onTabChanged(event: any) {
    }

    getSustitutes(): void {
        this.dataContext.get('user/schoolSubList').subscribe((data: any[]) => {
            this.schoolSubList = data;
            this.selectedSchoolSubList = data.filter(t => t.isAdded);
        },
            error => this.msg = <any>error);
    }

    getBlockedSustitutes(): void {
        this.dataContext.get('user/blockedSchoolSubList').subscribe((data: any[]) => {
            this.blockedSchoolSubList = data;
            this.selectedBlockedSchoolSubList = data.filter(t => t.isAdded);
        },
            error => this.msg = <any>error);
    }

    SearchSubstitute(query: string) {
        this.getSustitutes();
        this.dataContext.get('user/schoolSubList').subscribe((data: any[]) => {
            this.schoolSubList = data;
            this.selectedSchoolSubList = data.filter(t => t.isAdded);
            this.schoolSubList = this.schoolSubList.filter((val: SchoolSubList) => val.substituteName.toLowerCase().includes(query.toLowerCase()))
        },
            error => this.msg = <any>error);
    }

    SearchBlockedSubstitute(query: string) {
        this.getSustitutes();
        this.dataContext.get('user/blockedSchoolSubList').subscribe((data: any[]) => {
            this.blockedSchoolSubList = data;
            this.selectedBlockedSchoolSubList = data.filter(t => t.isAdded);
            this.blockedSchoolSubList = this.blockedSchoolSubList.filter((val: SchoolSubList) => val.substituteName.toLowerCase().includes(query.toLowerCase()))
        },
            error => this.msg = <any>error);
    }

    deleteSubstitute(index: number, substituteId: string) {
        this.selectedSchoolSubList.splice(index, 1);
        this.selectionlist.selectedOptions.selected.find(record => record.value.substituteId == substituteId).selected = false;
    }

    deleteBlockedSubstitute(index: number, substituteId: string) {
        this.selectedBlockedSchoolSubList.splice(index, 1);
        this.blockedselectionlist.selectedOptions.selected.find(record => record.value.substituteId == substituteId).selected = false;
    }

    selectionChangeSchoolSublist(schoolSubList: any, subtituteId: string) {
        // if (this.selectedBlockedSchoolSubList.find(record => record.substituteId == subtituteId)) {
        //     this.notifier.notify('error', 'Already added in blocked Substitute list');
        // }
        schoolSubList.options._results.forEach(element => {
            if (element.selected) {
                this.selectedSchoolSubList = this.selectedSchoolSubList.filter(t => t.substituteId !== element.value.substituteId);
                this.selectedBlockedSchoolSubList = this.selectedBlockedSchoolSubList.filter(t => t.substituteId !== element.value.substituteId);
                this.selectedSchoolSubList.push(element.value);
            }
            else {
                this.selectedSchoolSubList = this.selectedSchoolSubList.filter(t => t.substituteId !== element.value.substituteId);
            }
        });
    }

    selectionChangeBlockedSchoolSublist(blockedSchoolSubList: any, subtituteId: string) {
        // if (this.selectedSchoolSubList.find(record => record.substituteId == subtituteId)) {
        //     this.notifier.notify('error', 'Already added in School Substitute list');
        // }
        blockedSchoolSubList.options._results.forEach(element => {
            if (element.selected) {
                this.selectedBlockedSchoolSubList = this.selectedBlockedSchoolSubList.filter(t => t.substituteId !== element.value.substituteId);
                this.selectedSchoolSubList = this.selectedSchoolSubList.filter(t => t.substituteId !== element.value.substituteId);
                this.selectedBlockedSchoolSubList.push(element.value);
            }
            else {
                this.selectedBlockedSchoolSubList = this.selectedBlockedSchoolSubList.filter(t => t.substituteId !== element.value.substituteId);
            }
        });
    }

    updateSchoolSublist() {
        let model = {
            substituteId: JSON.stringify(this.selectedSchoolSubList)
        }
        this.dataContext.Patch('user/schoolSubList', model).subscribe((response: any) => {
            this.getSustitutes();
            this.notifier.notify('success', 'update Successfully');
        },
            error => this.msg = <any>error);
    }

    updateBlockedSchoolSublist() {
        let model = {
            substituteId: JSON.stringify(this.selectedBlockedSchoolSubList)
        }
        this.dataContext.Patch('user/blockedSchoolSubList', model).subscribe((response: any) => {
            this.getBlockedSustitutes();
            this.notifier.notify('success', 'update Successfully');
        },
            error => this.msg = <any>error);
    }
}