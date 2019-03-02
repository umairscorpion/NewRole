import { FormBuilder } from "@angular/forms";

export class ReportFilter {
  reportType: string;
  reportTitle: string;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  jobNumber: string;
  employeeTypeId: number;
  absenceTypeId: number;
  locationId: number;
  districtId: number;
  reasonId: number;
  employeeName: string;
  static CreateFilterFormGroup(fb: FormBuilder) {
    return fb.group({
      fromDate: [new Date()],
      toDate: [new Date()],
      jobNumber: [''],
      employeeTypeId: [0],
      absenceTypeId: [0],
      locationId: [0],
      districtId: [0],
      reasonId: [0],
      employeeName: [''],
    });
  }
}
