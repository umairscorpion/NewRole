import { Component, OnInit, ViewChild } from '@angular/core';
import { DataContext } from '../../../../Services/dataContext.service';
import { EmployeeService } from '../../../../Service/Manage/employees.service';
import { UserSession } from '../../../../Services/userSession.service';
import { SchoolSubList } from '../../../../Model/SchoolSubList';
import { MatSelectionList } from '../../../../../../node_modules/@angular/material';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'school-sub-list',
    templateUrl: 'schoolSubList.component.html',
    styleUrls: ['schoolSubList.component.scss']
})

export class SchoolSubListComponent implements OnInit {
    @ViewChild('subzz') selectionlist: MatSelectionList;
    private notifier: NotifierService;
    msg: string;
    schoolSubList: SchoolSubList[] = Array<SchoolSubList>();
    selectedSchoolSubList: SchoolSubList[] = Array<SchoolSubList>();
    blockedSchoolSubList: SchoolSubList[] = Array<SchoolSubList>();
    selectedBlockedSchoolSubList: SchoolSubList[] = Array<SchoolSubList>();
    constructor(private _employeeService: EmployeeService, private userSession: UserSession,
                 private dataContext: DataContext, notifier: NotifierService) { }
    ngOnInit(): void {
        this.getSustitutes();
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

    SearchSubstitute(query: string) {
        this.getSustitutes();
        this.dataContext.get('user/schoolSubList').subscribe((data: any[]) => {
            this.schoolSubList = data;
            this.selectedSchoolSubList = data.filter(t => t.isAdded);
            this.schoolSubList = this.schoolSubList.filter((val: SchoolSubList) => val.substituteName.toLowerCase().includes(query.toLowerCase()))
        },
            error => this.msg = <any>error);
    }

    deleteSubstitute(index: number, substituteId: string) {
        this.selectedSchoolSubList.splice(index, 1);
        this.selectionlist.selectedOptions.selected.find(record => record.value.substituteId == substituteId).selected = false;
    }

    selectionChangeSchoolSublist(schoolSubList: any) {
        schoolSubList.options._results.forEach(element => {
            if (element.selected) {
                this.selectedSchoolSubList = this.selectedSchoolSubList.filter(t => t.substituteId !== element.value.substituteId);
                this.selectedSchoolSubList.push(element.value);
            }
            else {
                this.selectedSchoolSubList = this.selectedSchoolSubList.filter(t => t.substituteId !== element.value.substituteId);
            }
        });
    }

    updateSchoolSublist() {
        let model = {
            substituteId: JSON.stringify(this.selectedSchoolSubList)
        }
        this.dataContext.Patch('user/schoolSubList', model).subscribe((response: any) => {
            this.getSustitutes();
            this.notifier.notify('sucess', 'update Successfully');
        },
            error => this.msg = <any>error);
    }
}