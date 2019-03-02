import { FormBuilder } from "@angular/forms";

export class ReportFilter {
  reportType: string;
  reportTitle: string;
  fromDate: string;
  toDate: string;
  jobNumber: string;
  employeeTypeId: number;
  absenceTypeId: number;
  locationId: number;
  districtId: number;
  reasonId: number;
  employeeName: string;
  static CreateFilterFormGroup(fb: FormBuilder) {
    return fb.group({
      fromDate: [''],
      toDate: [0],
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
