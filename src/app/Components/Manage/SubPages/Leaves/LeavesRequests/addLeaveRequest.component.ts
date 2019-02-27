import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,FormControl ,NgForm } from '@angular/forms';
import { DistrictService } from '../../../../../Service/Manage/district.service';
import { EmployeeService } from '../../../../../Service/Manage/employees.service';
import { HttpErrorResponse } from '@angular/common/http';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    templateUrl: 'addLeaveRequest.component.html'
})
export class AddLeaveRequestComponent implements OnInit {
    Country = new FormControl('', [Validators.required]);
    msg: string;
    LeaveRequestForm: FormGroup;
    EmployeeIdForLeaveRequest : number;
    Employees : any;
    Leaves : any ;
    constructor(private _FormBuilder: FormBuilder, private _EmployeeService: EmployeeService, private _districtService :DistrictService) { }
    ngOnInit(): void { 
        this.LeaveRequestForm = this._FormBuilder.group({
            Employee: ['', Validators.required],
            Description: ['', Validators.required],
            LeaveType: [null, Validators.required],
            Duration: ['', Validators.required],
            LeaveStartDate: ['', Validators.required],
            LeaveEndDate: ['', Validators.required],
            StartTime: ['', Validators.required],
            EndTime: ['', Validators.required]
        });
        this.GetEmployees();
        this.GetLeaveTypes();
    }
    GetEmployees(): void {
        let RoleId = 3;
        let OrgId = -1;
        let DistrictId = -1;
        this._EmployeeService.get('user/getEmployees',RoleId, OrgId, DistrictId).subscribe((data: any) => {
            this.Employees = data ; 
        },
            error => <any>error);
    }
    GetLeaveTypes(): void {
        this._districtService.get('Leave/GetLeaveTypes').subscribe((data: any) => {
          this.Leaves = data;
        },
          error => this.msg = <any>error);
    }
    employeeSelection( EmployeeDetail: any){
        this.EmployeeIdForLeaveRequest = EmployeeDetail.UserId ;
    }
    SearchEmployees(SearchEmployees : string) {  
        console.log(SearchEmployees);
    }
    onSubmitLeaveRequestForm(form : any) {
        if (this.LeaveRequestForm.valid) {
            let leaveRequestModel = {
                EmployeeId: this.EmployeeIdForLeaveRequest,
                Description: form.value.Description,
                LeaveTypeId: form.value.LeaveType.LeaveTypeId,
                StartDate: form.value.LeaveEndDate,
                EndDate: form.value.EndDate,
                StartTime: form.value.StartTime,
                EndTime: form.value.EndTime,
            }
            this._districtService.post('Leave/insertLeaveRequest', leaveRequestModel).subscribe((data: any) => {
                // this.toastr.success('Added Successfully!', 'Success!');
            },
                (err: HttpErrorResponse) => {
                    // this.toastr.error(err.error.error_description, 'Oops!');
                });
        }
    }
}